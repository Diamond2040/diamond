import {
  Injectable, forwardRef, Inject
} from '@nestjs/common';
import { Model } from 'mongoose';
import {
  EntityNotFoundException, QueueEventService
} from 'src/kernel';
import { ObjectId } from 'mongodb';
import { FileService } from 'src/modules/file/services';
import { FileDto } from 'src/modules/file';
import { UserDto } from 'src/modules/user/dtos';
import { REF_TYPE } from 'src/modules/file/constants';
import { isObjectId } from 'src/kernel/helpers/string.helper';
import { CategoryService } from 'src/modules/category/services';
import { EVENT } from 'src/kernel/constants';
import { UserService } from 'src/modules/user/services';
import { PerformerDto } from '../dtos';
import {
  UsernameExistedException,
  EmailExistedException
} from '../exceptions';
import {
  PerformerModel
} from '../models';
import {
  PerformerCreatePayload,
  PerformerUpdatePayload
} from '../payloads';
import { PERFORMER_MODEL_PROVIDER } from '../providers';
import { PERFORMER_CHANNEL } from '../constants';

@Injectable()
export class PerformerService {
  constructor(
    @Inject(forwardRef(() => CategoryService))
    private readonly categoryService: CategoryService,
    @Inject(PERFORMER_MODEL_PROVIDER)
    private readonly Performer: Model<PerformerModel>,
    private readonly fileService: FileService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly queueEventService: QueueEventService
  ) {}

  public async findById(id: string | ObjectId): Promise<PerformerDto> {
    const model = await this.Performer.findById(id);
    if (!model) return null;
    return new PerformerDto(model);
  }

  public async findByUsername(username: string): Promise<PerformerDto> {
    const query = isObjectId(username)
      ? { _id: username }
      : { username: { $regex: username } };
    const model = await this.Performer.findOne(query);
    if (!model) return null;
    const dto = new PerformerDto(model);
    if (model.avatarId) {
      const avatar = await this.fileService.findById(model.avatarId);
      dto.avatarPath = avatar ? avatar.path : null;
    }
    if (model.welcomeVideoId) {
      const welcomeVideo = await this.fileService.findById(
        model.welcomeVideoId
      );
      dto.welcomeVideoPath = welcomeVideo ? welcomeVideo.getUrl() : null;
    }

    if (model.categoryIds?.length) {
      dto.categories = await (await this.categoryService.findByIds(model.categoryIds)).map((c) => ({
        _id: c._id,
        slug: c.slug,
        name: c.name
      }));
    }

    // await this.Performer.updateOne(
    //   { _id: model._id },
    //   {
    //     $inc: { 'stats.views': 1 }
    //   }
    // );
    return dto;
  }

  public async findByEmail(email: string): Promise<PerformerDto> {
    if (!email) {
      return null;
    }
    const model = await this.Performer.findOne({
      email: email.toLowerCase()
    });
    if (!model) return null;
    return new PerformerDto(model);
  }

  public async findByIds(ids: any[]): Promise<PerformerDto[]> {
    const performers = await this.Performer.find({
      _id: {
        $in: ids
      }
    })
      .lean()
      .exec();
    return performers.map((p) => new PerformerDto(p));
  }

  public async getDetails(
    id: string | ObjectId,
    options = {
      responseDocument: false,
      jwtToken: ''
    }
  ): Promise<PerformerDto> {
    const performer = await this.Performer.findById(id);
    if (!performer) {
      throw new EntityNotFoundException();
    }

    const [avatar, welcomeVideo, categories] = await Promise.all([
      performer.avatarId ? this.fileService.findById(performer.avatarId) : null,
      performer.welcomeVideoId
        ? this.fileService.findById(performer.welcomeVideoId)
        : null,
      performer.categoryIds.length
        ? this.categoryService.findByIds(performer.categoryIds)
        : []
    ]);

    // TODO - update kernel for file dto
    const dto = new PerformerDto(performer);
    // TODO - check me
    dto.avatar = avatar ? FileDto.getPublicUrl(avatar.path) : null; // TODO - get default avatar
    dto.welcomeVideoPath = welcomeVideo
      ? FileDto.getPublicUrl(welcomeVideo.path)
      : null;
    dto.categories = categories;

    if (options?.responseDocument) {
      const [documentVerification, idVerification] = await Promise.all([
        performer.documentVerificationId
          ? this.fileService.findById(performer.documentVerificationId)
          : null,
        performer.idVerificationId
          ? this.fileService.findById(performer.idVerificationId)
          : null
      ]);

      dto.idVerification = idVerification
        ? {
          _id: idVerification._id,
          url: options.jwtToken
            ? `${FileDto.getPublicUrl(idVerification.path)}?documentId=${
              idVerification._id
            }&token=${options.jwtToken}`
            : FileDto.getPublicUrl(idVerification.path),
          mimeType: idVerification.mimeType
        }
        : null;
      dto.documentVerification = documentVerification
        ? {
          _id: documentVerification._id,
          url: options.jwtToken
            ? `${FileDto.getPublicUrl(
              documentVerification.path
            )}?documentId=${documentVerification._id}&token=${options.jwtToken}`
            : FileDto.getPublicUrl(documentVerification.path),
          mimeType: documentVerification.mimeType
        }
        : null;
    }

    return dto;
  }

  public async create(
    payload: PerformerCreatePayload,
    user?: UserDto
  ): Promise<PerformerDto> {
    const data = {
      ...payload,
      updatedAt: new Date(),
      createdAt: new Date()
    } as any;
    const userNameCheck = await this.Performer.countDocuments({
      username: payload.username.trim()
    });
    if (userNameCheck) {
      throw new UsernameExistedException();
    }
    const usernameCheck2 = await this.userService.findByUsername(
      payload.username.trim()
    );
    if (usernameCheck2) {
      throw new UsernameExistedException();
    }
    const emailCheck = await this.userService.findByEmail(payload.email);
    if (emailCheck) {
      throw new EmailExistedException();
    }

    // TODO - check for category Id, studio
    if (user) {
      data.createdBy = user._id;
    }
    data.username = data.username.trim();
    data.email = data.email ? data.email.toLowerCase() : null;
    if (!data.name) data.name = data.username;

    const performer = await this.Performer.create(data);

    // update / create auth
    await this.queueEventService.publish({
      channel: PERFORMER_CHANNEL,
      eventName: EVENT.CREATED,
      data: {
        performer: performer.toObject(),
        payload
      }
    });

    return new PerformerDto(performer);
  }

  public async update(
    id: string | ObjectId,
    payload: Partial<PerformerUpdatePayload>
  ): Promise<any> {
    const performer = await this.Performer.findById(id);
    if (!performer) {
      throw new EntityNotFoundException();
    }
    const data = { ...payload, updatedAt: new Date() } as any;
    if (!data.name) {
      data.name = [data.firstName || '', data.lastName || ''].join(' ');
    }
    if (data.username && data.username.trim() !== performer.username) {
      const usernameCheck = await this.Performer.countDocuments({
        username: data.username.trim(),
        _id: { $ne: performer._id }
      });
      if (usernameCheck) {
        throw new UsernameExistedException();
      }
      const usernameCheck2 = await this.userService.findByUsername(
        payload.username.trim()
      );
      if (usernameCheck2._id.toString() !== performer.userId?.toString()) {
        throw new UsernameExistedException();
      }
      data.username = data.username.trim();
    }
    data.categoryIds = data.categoryIds || [];
    if (!data.name) data.name = data.username;
    await this.Performer.updateOne({ _id: id }, data);

    // update / create auth
    // reload new data and fire event
    const newData = await this.Performer.findById(id);
    await this.queueEventService.publish({
      channel: PERFORMER_CHANNEL,
      eventName: EVENT.UPDATED,
      data: {
        performer: newData.toObject(),
        payload
      }
    });
    return { updated: true };
  }

  public async updateAvatar(performer: PerformerDto, file: FileDto) {
    await this.Performer.updateOne(
      { _id: performer._id },
      {
        avatarId: file._id,
        avatarPath: file.path
      }
    );
    await this.fileService.addRef(file._id, {
      itemId: performer._id,
      itemType: REF_TYPE.PERFORMER
    });

    const p = await this.Performer.findById(performer._id);

    await this.queueEventService.publish({
      channel: PERFORMER_CHANNEL,
      eventName: 'avatarUpdated',
      data: {
        performer: p.toObject(),
        file
      }
    });

    return file;
  }

  public async updateWelcomeVideo(user: PerformerDto, file: FileDto) {
    await this.Performer.updateOne(
      { _id: user._id },
      {
        welcomeVideoId: file._id,
        welcomeVideoPath: file.path
      }
    );

    await this.fileService.addRef(file._id, {
      itemId: user._id,
      itemType: REF_TYPE.PERFORMER
    });

    return file;
  }

  public async updateLikeStat(performerId: string | ObjectId, num = 1) {
    return this.Performer.updateOne(
      { _id: performerId },
      {
        $inc: { 'stats.likes': num }
      }
    );
  }

  public async findByUserId(userId: string | ObjectId) {
    return this.Performer.findOne({ userId });
  }

  public async getRelated(performerId: string | ObjectId, limit = 10) {
    const query = isObjectId(performerId.toString())
      ? { _id: performerId }
      : ({ username: performerId } as any);
    const performer = await this.Performer.findOne(query);
    // TODO - define the rules
    const aggQuery = [];
    if (performer) {
      aggQuery.push({
        $match: {
          _id: {
            $ne: performer._id
          },
          status: 'active'
        }
      });
      if (performer.categoryIds?.length) {
        aggQuery[0].$match.categoryIds = {
          $in: performer.categoryIds
        };
      }
    }
    aggQuery.push({
      $sample: {
        size: limit
      }
    });
    const data = await this.Performer.aggregate(aggQuery);

    return data.map((p) => new PerformerDto(p)).map((p) => p.toSearchResponse());
  }

  public async calculateScore(performerId) {
    const performer = performerId instanceof this.Performer
      ? performerId
      : await this.Performer.findById(performerId);
    if (!performer) return 0;

    let score = 0;
    if (performer.vip) score += 1;
    if (performer.verified) score += 1;
    return score;
  }

  public async updateVip(performerId, vip = true) {
    const performer = await this.Performer.findOne({ _id: performerId });
    if (performer) {
      performer.vip = vip;
      performer.score = await this.calculateScore(performer);
      await performer.save();
    }
  }

  public async updateEmailVerify(performerId, verifiedEmail = true) {
    const performer = await this.Performer.findOne(
      {
        $or: [{
          _id: performerId
        }, {
          userId: performerId
        }]
      }
    );
    if (performer) {
      performer.verifiedEmail = verifiedEmail;
      await performer.save();
      await this.queueEventService.publish({
        channel: PERFORMER_CHANNEL,
        eventName: EVENT.UPDATED,
        data: {
          performer: performer.toObject()
        }
      });
    }
  }

  public async updateMembershipType(performerId, membershipType = null) {
    return this.Performer.updateOne({ _id: performerId }, {
      $set: {
        membershipType
      }
    });
  }
}
