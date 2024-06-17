import {
  Injectable, Inject, forwardRef, HttpException
} from '@nestjs/common';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import {
  QueueEventService,
  QueueEvent,
  AgendaService,
  EntityNotFoundException,
  ForbiddenException,
  StringHelper
} from 'src/kernel';
import { FileDto } from 'src/modules/file';
import { UserDto } from 'src/modules/user/dtos';
import { FileService, FILE_EVENT } from 'src/modules/file/services';
import { ReactionService } from 'src/modules/reaction/services/reaction.service';
import { REACTION } from 'src/modules/reaction/constants';
import { PerformerService } from 'src/modules/performer/services';
import { merge } from 'lodash';
import { CheckPaymentService } from 'src/modules/payment/services';
import { EVENT } from 'src/kernel/constants';
import { REF_TYPE } from 'src/modules/file/constants';
import { isObjectId } from 'src/kernel/helpers/string.helper';
import { SubscriptionService } from 'src/modules/subscription/services/subscription.service';
import { CategoryService } from 'src/modules/category/services';
import { VideoUpdatePayload } from '../payloads';
import { VideoDto } from '../dtos';
import { VIDEO_STATUS } from '../constants';
import { VideoCreatePayload } from '../payloads/video-create.payload';
import { VideoModel } from '../models';
import { PERFORMER_VIDEO_MODEL_PROVIDER } from '../providers';

export const VIDEO_CHANNEL = 'VIDEO_CHANNEL';
export const VIDEO_TEASER_CHANNEL = 'VIDEO_TEASER_CHANNEL';
export const COUNT_VIDEO_CHANNEL = 'COUNT_VIDEO_CHANNEL';
const FILE_PROCESSED_TOPIC = 'FILE_PROCESSED';
const SCHEDULE_VIDEO_AGENDA = 'SCHEDULE_VIDEO_AGENDA';

@Injectable()
export class VideoService {
  constructor(
    @Inject(forwardRef(() => PerformerService))
    private readonly performerService: PerformerService,
    @Inject(forwardRef(() => SubscriptionService))
    private readonly subscriptionService: SubscriptionService,
    @Inject(forwardRef(() => ReactionService))
    private readonly reactionService: ReactionService,
    @Inject(forwardRef(() => CheckPaymentService))
    private readonly checkPaymentService: CheckPaymentService,
    @Inject(forwardRef(() => CategoryService))
    private readonly categoryService: CategoryService,
    @Inject(PERFORMER_VIDEO_MODEL_PROVIDER)
    private readonly videoModel: Model<VideoModel>,
    private readonly queueEventService: QueueEventService,
    private readonly fileService: FileService,
    private readonly agenda: AgendaService
  ) {
    this.queueEventService.subscribe(
      VIDEO_CHANNEL,
      FILE_PROCESSED_TOPIC,
      this.handleFileProcessed.bind(this)
    );
    this.queueEventService.subscribe(
      VIDEO_TEASER_CHANNEL,
      FILE_PROCESSED_TOPIC,
      this.handleTeaserProcessed.bind(this)
    );
    this.defindJobs();
  }

  private async defindJobs() {
    const collection = (this.agenda as any)._collection;
    await collection.deleteMany({
      name: {
        $in: [
          SCHEDULE_VIDEO_AGENDA
        ]
      }
    });

    this.agenda.define(SCHEDULE_VIDEO_AGENDA, { }, this.scheduleVideo.bind(this));
    this.agenda.schedule('1 hour from now', SCHEDULE_VIDEO_AGENDA, {});
  }

  private async scheduleVideo(job: any, done: any): Promise<void> {
    try {
      const videos = await this.videoModel.find({
        isSchedule: true,
        scheduledAt: { $lt: new Date() }
      });
      // eslint-disable-next-line no-restricted-syntax
      for (const video of videos) {
        const v = new VideoDto(video);
        // eslint-disable-next-line no-await-in-loop
        await this.videoModel.updateOne(
          {
            _id: v._id
          },
          {
            isSchedule: false,
            status: VIDEO_STATUS.ACTIVE,
            updatedAt: new Date()
          }
        );
        const oldStatus = video.status;
        // eslint-disable-next-line no-await-in-loop
        await this.queueEventService.publish(
          new QueueEvent({
            channel: COUNT_VIDEO_CHANNEL,
            eventName: EVENT.UPDATED,
            data: {
              ...v,
              oldStatus
            }
          })
        );
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('Schedule error', e);
    } finally {
      job.remove();
      this.agenda.schedule('1 hour from now', SCHEDULE_VIDEO_AGENDA, {});
      typeof done === 'function' && done();
    }
  }

  public async handleTeaserProcessed(event: QueueEvent) {
    const { eventName } = event;
    if (eventName !== FILE_EVENT.VIDEO_PROCESSED) {
      return;
    }
    const { videoId } = event.data.meta;
    const [video] = await Promise.all([
      this.videoModel.findById(videoId)
    ]);
    if (!video) {
      await this.fileService.remove(event.data.fileId);
      // TODO - delete file?
      return;
    }
    video.teaserProcessing = false;
    await video.save();
  }

  public async handleFileProcessed(event: QueueEvent) {
    const { eventName } = event;
    if (eventName !== FILE_EVENT.VIDEO_PROCESSED) {
      return;
    }
    const { videoId } = event.data.meta;
    const [video, file] = await Promise.all([
      this.videoModel.findById(videoId),
      this.fileService.findById(event.data.fileId)
    ]);
    if (!video) {
      // TODO - delete file?
      await this.fileService.remove(event.data.fileId);
      return;
    }
    video.processing = false;
    if (file.status === 'error') {
      video.status = VIDEO_STATUS.FILE_ERROR;
    }
    await video.save();
  }

  public async findById(id: string | ObjectId) {
    const video = await this.videoModel.findById(id);
    return new VideoDto(video);
  }

  public async findByIds(ids: string[] | ObjectId[]) {
    return this.videoModel.find({ _id: { $in: ids } });
  }

  private getVideoForView(fileDto: FileDto, video: VideoDto, jwToken?: string) {
    // get thumb, video link, thumbnails, etc...
    let file = fileDto.getUrl();
    if (video && jwToken) {
      file = `${file}?videoId=${video._id}&token=${jwToken}`;
    }
    return {
      url: file,
      duration: fileDto.duration,
      thumbnails: (fileDto.thumbnails || []).map((thumb) => FileDto.getPublicUrl(thumb.path))
    };
  }

  public async create(
    files: any,
    payload: VideoCreatePayload,
    creator: UserDto
  ): Promise<VideoDto> {
    let valid = true;
    const { video, thumbnail, teaser } = files;
    if (!video) valid = false;
    if (valid && !video?.mimeType?.toLowerCase().includes('video')) {
      await this.fileService.remove(video._id);
      valid = false;
    }
    if ((!valid && thumbnail) || (valid && thumbnail && !thumbnail.isImage())) {
      await this.fileService.remove(thumbnail._id);
    }

    if ((!valid && teaser) || (valid && teaser && !teaser.mimeType.toLowerCase().includes('video'))) {
      await this.fileService.remove(teaser._id);
    }

    if (!valid) {
      throw new HttpException('Invalid file format', 400);
    }

    // eslint-disable-next-line new-cap
    const model = new this.videoModel(payload);
    model.fileId = video._id;
    if (thumbnail && thumbnail._id) {
      model.thumbnailId = thumbnail._id;
    }
    if (teaser && teaser._id) {
      model.teaserId = teaser._id;
      model.teaserProcessing = true;
    }
    model.processing = true;
    model.slug = StringHelper.createAlias(payload.title);
    const slugCheck = await this.videoModel.countDocuments({
      slug: model.slug
    });
    if (slugCheck) {
      model.slug = `${model.slug}-${StringHelper.randomString(8)}`;
    }
    creator && model.set('createdBy', creator._id);
    model.createdAt = new Date();
    model.updatedAt = new Date();
    await model.save();
    await Promise.all([
      model.thumbnailId && this.fileService.addRef(model.thumbnailId, {
        itemId: model._id,
        itemType: REF_TYPE.VIDEO
      }),
      model.fileId && this.fileService.addRef(model.fileId, {
        itemType: REF_TYPE.VIDEO,
        itemId: model._id
      }),
      model.teaserId && this.fileService.addRef(model.teaserId, {
        itemType: REF_TYPE.VIDEO,
        itemId: model._id
      }),
      model.fileId && this.fileService.queueProcessVideo(model.fileId, {
        publishChannel: VIDEO_CHANNEL,
        meta: {
          videoId: model._id
        }
      }),
      model.teaserId && this.fileService.queueProcessVideo(model.teaserId, {
        publishChannel: VIDEO_TEASER_CHANNEL,
        meta: {
          videoId: model._id
        }
      })
    ]);
    await this.queueEventService.publish(
      new QueueEvent({
        channel: COUNT_VIDEO_CHANNEL,
        eventName: EVENT.CREATED,
        data: new VideoDto(model)
      })
    );
    return new VideoDto(model);
  }

  // TODO - add a service to query details from public user
  // this request is for admin or owner only?
  public async getDetails(videoId: string | ObjectId, jwToken: string): Promise<VideoDto> {
    const video = await this.videoModel.findById(videoId);
    if (!video) throw new EntityNotFoundException();
    const [performers, videoFile, teaserFile, thumbnailFile] = await Promise.all([
      video.performerIds?.length ? this.performerService.findByIds(video.performerIds) : [],
      this.fileService.findById(video.fileId),
      video.teaserId && this.fileService.findById(video.teaserId),
      video.thumbnailId ? this.fileService.findById(video.thumbnailId) : null
    ]);

    // TODO - define interface or dto?
    const dto = new VideoDto(video);
    dto.thumbnail = thumbnailFile ? {
      thumbnails: (thumbnailFile.thumbnails || []).map((thumb) => FileDto.getPublicUrl(thumb.path)),
      url: thumbnailFile.getUrl() || null
    } : null;
    dto.video = videoFile && this.getVideoForView(videoFile, dto, jwToken);
    dto.teaser = teaserFile && this.getVideoForView(teaserFile, dto);
    dto.performers = performers.map((performer) => performer.toSearchResponse());
    return dto;
  }

  public async userGetDetails(id: string, currentUser: UserDto, jwToken: string): Promise<VideoDto> {
    const query = !isObjectId(`${id}`) ? { slug: id } : { _id: id } as any;
    const video = await this.videoModel.findOne(query);
    if (!video) throw new EntityNotFoundException();
    const [performers, categories, videoFile, teaserFile, thumbnailFile, reactions] = await Promise.all([
      video.performerIds && video.performerIds.length ? this.performerService.findByIds(video.performerIds) : [],
      video.categoryIds && video.categoryIds.length ? this.categoryService.findByIds(video.categoryIds) : [],
      video.fileId && this.fileService.findById(video.fileId),
      video.teaserId && this.fileService.findById(video.teaserId),
      video.thumbnailId && this.fileService.findById(video.thumbnailId),
      currentUser?._id ? this.reactionService.findByQuery({ objectId: video._id, createdBy: currentUser._id }) : []
    ]);
      // TODO - define interface or dto?
    const dto = new VideoDto(video);
    dto.isLiked = !!reactions.filter((r) => r.action === REACTION.LIKE).length;
    dto.isFavourited = !!reactions.filter((r) => r.action === REACTION.FAVOURITE).length;
    dto.isWatchedLater = !!reactions.filter((r) => r.action === REACTION.WATCH_LATER).length;
    if (dto.isSale) {
      const bought = currentUser && await this.checkPaymentService.checkBoughtVideo(dto, currentUser);
      dto.isBought = !!bought;
      if (currentUser && currentUser.roles.includes('admin')) {
        dto.isBought = true;
      }
    }
    dto.thumbnail = thumbnailFile && thumbnailFile.getUrl();
    dto.video = videoFile && this.getVideoForView(videoFile, dto, jwToken);
    dto.teaser = teaserFile && this.getVideoForView(teaserFile, dto);
    dto.performers = performers.map((p) => p.toPublicDetailsResponse());
    dto.categories = categories.map((c) => ({
      name: c.name,
      slug: c.slug,
      _id: c._id
    }));
    // increase view stats
    await this.increaseView(dto._id);
    return dto;
  }

  public async updateInfo(id: string | ObjectId, files: any, payload: VideoUpdatePayload, updater: UserDto): Promise<VideoDto> {
    const { video: videoFile, thumbnail: thumbnailFile, teaser: teaserFile } = files;
    const video = await this.videoModel.findById(id);
    if (!video) {
      throw new EntityNotFoundException();
    }
    const { fileId, thumbnailId, teaserId } = video;
    if (videoFile && videoFile._id) {
      video.fileId = videoFile._id;
    }
    if (thumbnailFile && thumbnailFile._id) {
      video.thumbnailId = thumbnailFile._id;
    }
    if (teaserFile && teaserFile._id) {
      video.teaserId = teaserFile._id;
    }
    if (videoFile && !videoFile?.mimeType?.toLowerCase().includes('video')) {
      await this.fileService.remove(videoFile._id);
      delete video.fileId;
    }
    if (thumbnailFile && !thumbnailFile.isImage()) {
      await this.fileService.remove(thumbnailFile._id);
      delete video.thumbnailId;
    }
    if (teaserFile && !teaserFile.mimeType.toLowerCase().includes('video')) {
      await this.fileService.remove(teaserFile._id);
      delete video.teaserId;
    }
    const oldStatus = video.status;
    let { slug } = video;
    if (payload.title !== video.title) {
      slug = StringHelper.createAlias(payload.title);
      const slugCheck = await this.videoModel.countDocuments({
        slug,
        _id: { $ne: video._id }
      });
      if (slugCheck) {
        slug = `${slug}-${StringHelper.randomString(8)}`;
      }
    }
    merge(video, payload);
    if (video.status !== VIDEO_STATUS.FILE_ERROR && payload.status !== VIDEO_STATUS.FILE_ERROR) {
      video.status = payload.status;
    }
    video.tags = payload.tags || [];
    video.performerIds = payload.performerIds || [];
    video.categoryIds = payload.categoryIds || [];
    updater && video.set('updatedBy', updater._id);
    video.updatedAt = new Date();
    video.slug = slug;
    await video.save();
    const dto = new VideoDto(video);
    if (thumbnailFile && `${video.thumbnailId}` !== `${thumbnailId}`) {
      await Promise.all([
        this.fileService.addRef(video.thumbnailId, {
          itemId: video._id,
          itemType: REF_TYPE.VIDEO
        }),
        thumbnailId && this.fileService.remove(thumbnailId)
      ]);
    }
    if (videoFile && `${video.fileId}` !== `${fileId}`) {
      // add ref, remove old file, convert file
      await Promise.all([
        this.fileService.addRef(video.fileId, {
          itemId: video._id,
          itemType: REF_TYPE.VIDEO
        }),
        fileId && this.fileService.remove(fileId),
        this.fileService.queueProcessVideo(video.fileId, {
          publishChannel: VIDEO_CHANNEL,
          meta: {
            videoId: video._id
          }
        })
      ]);
    }
    if (teaserFile && `${video.teaserId}` !== `${teaserId}`) {
      // add ref, remove old file, convert file
      await Promise.all([
        this.fileService.addRef(video.teaserId, {
          itemId: video._id,
          itemType: REF_TYPE.VIDEO
        }),
        teaserId && this.fileService.remove(teaserId),
        this.fileService.queueProcessVideo(video.teaserId, {
          publishChannel: VIDEO_TEASER_CHANNEL,
          meta: {
            videoId: video._id
          }
        })
      ]);
    }
    // update performer stats
    await this.queueEventService.publish(
      new QueueEvent({
        channel: COUNT_VIDEO_CHANNEL,
        eventName: EVENT.UPDATED,
        data: {
          ...dto,
          oldStatus
        }
      })
    );

    return dto;
  }

  public async delete(id: string | ObjectId) {
    const video = await this.videoModel.findById(id);
    if (!video) {
      throw new EntityNotFoundException();
    }

    await video.remove();
    video.fileId && (await this.fileService.remove(video.fileId));
    video.teaserId && (await this.fileService.remove(video.teaserId));
    video.thumbnailId && (await this.fileService.remove(video.thumbnailId));
    await this.queueEventService.publish(
      new QueueEvent({
        channel: COUNT_VIDEO_CHANNEL,
        eventName: EVENT.DELETED,
        data: new VideoDto(video)
      })
    );
    return true;
  }

  public async increaseView(id: string | ObjectId) {
    return this.videoModel.updateOne(
      { _id: id },
      {
        $inc: { 'stats.views': 1 }
      }
    );
  }

  public async increaseLike(id: string | ObjectId, num = 1) {
    return this.videoModel.updateOne(
      { _id: id },
      {
        $inc: { 'stats.likes': num }
      }
    );
  }

  public async increaseFavourite(id: string | ObjectId, num = 1) {
    return this.videoModel.updateOne(
      { _id: id },
      {
        $inc: { 'stats.favourites': num }
      }
    );
  }

  public async increaseWatchlater(id: string | ObjectId, num = 1) {
    return this.videoModel.updateOne(
      { _id: id },
      {
        $inc: { 'stats.wishlist': num }
      }
    );
  }

  public async increaseComment(id: string | ObjectId, num = 1) {
    return this.videoModel.updateOne(
      { _id: id },
      {
        $inc: { 'stats.comments': num }
      }
    );
  }

  public async checkAuth(req: any, user: UserDto) {
    const { query } = req;
    if (!query.videoId) {
      throw new ForbiddenException();
    }
    if (user.roles && user.roles.indexOf('admin') > -1) {
      return true;
    }
    // check type video
    const video = await this.videoModel.findById(query.videoId);
    if (!video) throw new ForbiddenException();
    if (!video.isSale) {
      // check subscription
      const subscribed = await this.subscriptionService.checkSubscribed(user._id);
      if (!subscribed) {
        throw new ForbiddenException();
      }
      return true;
    }
    if (video.isSale) {
      // check bought
      const bought = await this.checkPaymentService.checkBoughtVideo(new VideoDto(video), user);
      if (!bought) {
        throw new ForbiddenException();
      }
      return true;
    }
    throw new ForbiddenException();
  }
}
