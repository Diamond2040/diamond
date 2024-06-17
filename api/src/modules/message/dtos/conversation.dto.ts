import { ObjectId } from 'mongodb';
import { pick } from 'lodash';
import { IUserResponse } from 'src/modules/user/dtos';
import { IRecipient } from '../models';

export class ConversationDto {
  _id: ObjectId;

  type: string;

  name: string;

  recipients: IRecipient[];

  lastMessage: string;

  lastSenderId: string | ObjectId;

  lastMessageCreatedAt: Date;

  meta: any;

  createdAt: Date;

  updatedAt: Date;

  recipientInfo?: IUserResponse;

  totalNotSeenMessages?: number;

  constructor(data?: Partial<ConversationDto>) {
    Object.assign(
      this,
      pick(data, [
        '_id',
        'type',
        'name',
        'recipients',
        'lastMessage',
        'lastSenderId',
        'lastMessageCreatedAt',
        'meta',
        'createdAt',
        'updatedAt',
        'recipientInfo',
        'totalNotSeenMessages'
      ])
    );
  }
}
