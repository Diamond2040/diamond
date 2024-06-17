import {
  Injectable, Inject, HttpException, HttpStatus
} from '@nestjs/common';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { toObjectId } from 'src/kernel/helpers/string.helper';
import { UserSearchService, UserService } from 'src/modules/user/services';
import { UserDto } from 'src/modules/user/dtos';
import { UserSearchRequestPayload } from 'src/modules/user/payloads';
import { EntityNotFoundException } from 'src/kernel';
import { ConversationSearchPayload } from '../payloads';
import { ConversationDto } from '../dtos';
import { CONVERSATION_TYPE } from '../constants';
import { ConversationModel, NotificationMessageModel } from '../models';
import {
  CONVERSATION_MODEL_PROVIDER,
  NOTIFICATION_MESSAGE_MODEL_PROVIDER
} from '../providers';

export interface IRecipient {
  source: string;
  sourceId: ObjectId;
}

@Injectable()
export class ConversationService {
  constructor(
    @Inject(CONVERSATION_MODEL_PROVIDER)
    private readonly conversationModel: Model<ConversationModel>,
    private readonly userService: UserService,
    private readonly userSearchService: UserSearchService,
    @Inject(NOTIFICATION_MESSAGE_MODEL_PROVIDER)
    private readonly notiticationMessageModel: Model<NotificationMessageModel>
  ) {}

  public async findOne(params): Promise<ConversationModel> {
    return this.conversationModel.findOne(params);
  }

  public async createPrivateConversation(
    sender: IRecipient,
    receiver: IRecipient
  ): Promise<ConversationDto> {
    const user = await this.userService.findById(receiver.sourceId);
    if (!user) {
      throw new HttpException('Receiver Not Found', HttpStatus.BAD_REQUEST);
    }

    let conversation = await this.conversationModel
      .findOne({
        type: CONVERSATION_TYPE.PRIVATE,
        recipients: {
          $all: [
            {
              source: sender.source,
              sourceId: toObjectId(sender.sourceId)
            },
            {
              source: receiver.source,
              sourceId: receiver.sourceId
            }
          ]
        }
      })
      .lean()
      .exec();
    if (!conversation) {
      conversation = await this.conversationModel.create({
        type: CONVERSATION_TYPE.PRIVATE,
        recipients: [sender, receiver],
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // TODO - define DTO?
    const dto = new ConversationDto(conversation);
    dto.totalNotSeenMessages = 0;
    if (receiver.source === 'performer') {
      const per = await this.userService.findById(receiver.sourceId);
      if (per) {
        dto.recipientInfo = new UserDto(per).toResponse(false);
      }
    }
    if (receiver.source === 'user') {
      // const user = await this.userService.findById(receiver.sourceId);
      if (user) dto.recipientInfo = new UserDto(user).toResponse(false);
    }
    return dto;
  }

  public async getList(
    req: ConversationSearchPayload,
    sender: IRecipient
  ): Promise<any> {
    let query = {
      recipients: {
        $elemMatch: {
          source: sender.source,
          sourceId: toObjectId(sender.sourceId)
        }
      }
    } as any;
    // must be the first
    if (req.keyword) {
      let usersSearch = null;
      if (sender.source === 'user') {
        usersSearch = await this.userSearchService.searchByKeyword({
          q: req.keyword
        } as UserSearchRequestPayload);
      }
      if (sender.source === 'performer') {
        usersSearch = await this.userSearchService.searchByKeyword({
          q: req.keyword
        } as UserSearchRequestPayload);
      }
      const Ids = usersSearch ? usersSearch.map((u) => u._id) : [];
      query = {
        $and: [
          {
            recipients: {
              $elemMatch: {
                source: sender.source === 'user' ? 'performer' : 'user',
                sourceId: { $in: Ids }
              }
            }
          },
          {
            recipients: {
              $elemMatch: {
                source: sender.source,
                sourceId: toObjectId(sender.sourceId)
              }
            }
          }
        ]
      };
    }

    if (req.type) {
      query.type = req.type;
    }

    const [data, total] = await Promise.all([
      this.conversationModel
        .find(query)
        .lean()
        .limit(req.limit ? parseInt(req.limit as string, 10) : 10)
        .skip(parseInt(req.offset as string, 10))
        .sort({ lastMessageCreatedAt: -1, updatedAt: -1 }),
      this.conversationModel.countDocuments(query)
    ]);

    const conversations = data.map((d) => new ConversationDto(d));
    const recipientIds = conversations.map((c) => {
      const re = c.recipients.find(
        (rep) => rep.sourceId.toString() !== sender.sourceId.toString()
      );
      if (re) {
        return re.sourceId;
      }
      return null;
    });
    const conversationIds = data.map((d) => d._id);
    const [notifications] = await Promise.all([
      this.notiticationMessageModel.find({
        conversationId: { $in: conversationIds },
        recipientId: sender.sourceId
      })
    ]);
    const recipients = ((sender.source === 'user'
      ? await this.userService.findByIds(recipientIds)
      : await this.userService.findByIds(recipientIds)) as any) || [];

    conversations.forEach((conversation: ConversationDto) => {
      const recipient = conversation.recipients.find(
        (rep) => `${rep.sourceId}` !== `${sender.sourceId}`
      );
      if (recipient) {
        const recipientInfo = recipients.find(
          (r) => `${r._id}` === `${recipient.sourceId}`
        );
        if (recipientInfo) {
          // eslint-disable-next-line no-param-reassign
          conversation.recipientInfo = new UserDto(recipientInfo).toResponse();
        }
        // eslint-disable-next-line no-param-reassign
        conversation.totalNotSeenMessages = 0;
        if (notifications.length) {
          const conversationNotifications = notifications.find(
            (n) => n.conversationId.toString() === conversation._id.toString()
          );
          // eslint-disable-next-line no-param-reassign
          conversation.totalNotSeenMessages = conversationNotifications?.totalNotReadMessage || 0;
        }
      }
    });

    return {
      data: conversations,
      total
    };
  }

  public async findById(id: string | ObjectId) {
    return this.conversationModel.findById(id);
  }

  public async addRecipient(
    conversationId: string | ObjectId,
    recipient: IRecipient
  ) {
    return this.conversationModel.updateOne(
      { _id: conversationId },
      { $addToSet: { recipients: recipient } }
    );
  }

  public async loadConversation(
    conversationId: string | ObjectId,
    sender: IRecipient
  ) {
    const data = await this.findById(conversationId);
    if (!data) {
      throw new EntityNotFoundException();
    }

    const receiver = data.recipients.find(
      (item) => item.sourceId.toString() !== sender.sourceId.toString()
    );
    const [recipient, notification] = await Promise.all([
      this.userService.findById(receiver.sourceId),
      this.notiticationMessageModel.findOne({
        conversationId,
        recipientId: sender.sourceId
      })
    ]);

    const conversation = new ConversationDto(data);
    if (recipient) { conversation.recipientInfo = new UserDto(recipient).toResponse(); }
    conversation.totalNotSeenMessages = notification?.totalNotReadMessage || 0;
    return conversation;
  }
}
