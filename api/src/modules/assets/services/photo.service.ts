import {
  Injectable, Inject, forwardRef, HttpException
} from '@nestjs/common';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import {
  QueueEventService, QueueEvent, EntityNotFoundException,
  ForbiddenException
} from 'src/kernel';
import { FileDto } from 'src/modules/file';
import { UserDto } from 'src/modules/user/dtos';
import { FileService, FILE_EVENT } from 'src/modules/file/services';
import { merge } from 'lodash';
import { SubscriptionService } from 'src/modules/subscription/services/subscription.service';
import { REF_TYPE } from 'src/modules/file/constants';
import { PHOTO_STATUS } from '../constants';
import { PhotoDto, GalleryDto } from '../dtos';
import { PhotoCreatePayload, PhotoUpdatePayload } from '../payloads';
import { GalleryService } from './gallery.service';

import { PhotoModel } from '../models';
import { PERFORMER_PHOTO_MODEL_PROVIDER } from '../providers';

export const FILE_PHOTO_CHANNEL = 'FILE_PHOTO_CHANNEL';

const FILE_PROCESSED_TOPIC = 'FILE_PROCESSED';

@Injectable()
export class PhotoService {
  constructor(
    @Inject(forwardRef(() => GalleryService))
    private readonly galleryService: GalleryService,
    @Inject(PERFORMER_PHOTO_MODEL_PROVIDER)
    private readonly photoModel: Model<PhotoModel>,
    private readonly queueEventService: QueueEventService,
    private readonly fileService: FileService,
    private readonly subscriptionService: SubscriptionService
  ) {
    this.queueEventService.subscribe(
      FILE_PHOTO_CHANNEL,
      FILE_PROCESSED_TOPIC,
      this.handleFileProcessed.bind(this)
    );
  }

  public async handleFileProcessed(event: QueueEvent) {
    if (event.eventName !== FILE_EVENT.PHOTO_PROCESSED) return;

    const { photoId } = event.data.meta;
    const [photo, file] = await Promise.all([
      this.photoModel.findById(photoId),
      this.fileService.findById(event.data.fileId)
    ]);
    if (!photo) {
      // TODO - delete file?
      await this.fileService.remove(event.data.fileId);
      return;
    }
    photo.processing = false;
    if (file.status === 'error') {
      photo.status = PHOTO_STATUS.FILE_ERROR;
    }
    await photo.save();
    // add default cover photo to gallery
    if (file.status === 'error' || photo.target !== 'gallery' || !photo.targetId) return;
    await this.galleryService.updatePhotoStats(photo.targetId);
    // update cover field in the photo list
    const photoCover = await this.photoModel.findOne({
      targetId: photo.targetId,
      isCover: true
    });
    if (photoCover) return;
    const defaultCover = await this.photoModel.findOne({
      targetId: photo.targetId,
      status: PHOTO_STATUS.ACTIVE
    });
    if (!defaultCover || (photoCover && photoCover._id.toString() === defaultCover.toString())) return;
    await this.galleryService.updateCover(photo.targetId, defaultCover._id);
    await this.photoModel.updateOne(
      { _id: defaultCover._id },
      {
        isCover: true
      }
    );
  }

  public async findByQuery(query) {
    return this.photoModel.find(query);
  }

  public async create(file: FileDto, payload: PhotoCreatePayload, creator?: UserDto): Promise<PhotoDto> {
    if (!file) throw new HttpException('File is valid!', 400);
    if (!file.isImage()) {
      await this.fileService.removeIfNotHaveRef(file._id);
      throw new HttpException('Invalid image!', 400);
    }

    // process to create thumbnails
    // eslint-disable-next-line new-cap
    const photo = new this.photoModel(payload);
    if (!photo.title) photo.title = file.name;

    photo.fileId = file._id;
    photo.createdAt = new Date();
    photo.updatedAt = new Date();
    if (creator) {
      photo.createdBy = creator._id;
      photo.updatedBy = creator._id;
    }
    photo.processing = true;
    await photo.save();
    await Promise.all([
      this.fileService.addRef(file._id, {
        itemType: REF_TYPE.PHOTO,
        itemId: photo._id
      }),
      this.fileService.queueProcessPhoto(file._id, {
        meta: {
          photoId: photo._id
        },
        publishChannel: FILE_PHOTO_CHANNEL,
        thumbnailSize: {
          width: 250,
          height: 250
        }
      })
    ]);

    const dto = new PhotoDto(photo);

    return dto;
  }

  public async updateInfo(id: string | ObjectId, payload: PhotoUpdatePayload, updater?: UserDto): Promise<PhotoDto> {
    const photo = await this.photoModel.findById(id);
    if (!photo) {
      throw new EntityNotFoundException();
    }

    merge(photo, payload);
    if (photo.status !== PHOTO_STATUS.FILE_ERROR && payload.status !== PHOTO_STATUS.FILE_ERROR) {
      photo.status = payload.status;
    }
    updater && photo.set('updatedBy', updater._id);
    photo.updatedAt = new Date();
    await photo.save();
    const dto = new PhotoDto(photo);
    return dto;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async details(id: string | ObjectId, userDto?: UserDto): Promise<PhotoDto> {
    const photo = await this.photoModel.findOne({ _id: id });
    if (!photo) {
      throw new EntityNotFoundException();
    }

    const dto = new PhotoDto(photo);
    const [gallery, file] = await Promise.all([
      photo.targetId ? this.galleryService.findById(photo.targetId) : null,
      photo.fileId ? this.fileService.findById(photo.fileId) : null
    ]);
    if (gallery) dto.gallery = new GalleryDto(gallery);
    if (file) {
      dto.photo = {
        url: file.getUrl(),
        thumbnails: file.getThumbnails(),
        width: file.width,
        height: file.height
      };
    }

    return dto;
  }

  public async delete(id: string | ObjectId) {
    const photo = await this.photoModel.findById(id);
    if (!photo) {
      throw new EntityNotFoundException();
    }
    await photo.remove();
    // TODO - should check ref and remove
    await this.fileService.remove(photo.fileId);
    if (photo.targetId) {
      await this.galleryService.updatePhotoStats(photo.targetId, -1);
    }

    return true;
  }

  public async deleteByGallery(galleryId: string | ObjectId) {
    const photos = await this.photoModel.find({ tagetId: galleryId });
    if (photos && photos.length > 0) {
      await Promise.all(
        photos.map((photo) => {
          photo.remove();
          return this.fileService.remove(photo.fileId);
        })
      );
    }
    return true;
  }

  public async setCoverGallery(id: string | ObjectId): Promise<PhotoDto> {
    const photo = await this.photoModel.findById(id);
    if (!photo) {
      throw new EntityNotFoundException();
    }
    await this.photoModel.updateMany({
      targetId: photo.targetId
    }, {
      isCover: false
    }, { upsert: true });
    photo.isCover = true;
    await photo.save();
    photo.targetId && await this.galleryService.updateCover(photo.targetId, photo._id);
    return new PhotoDto(photo);
  }

  public async checkAuth(req: any, user: UserDto) {
    const { query } = req;
    if (!query.photoId) {
      throw new ForbiddenException();
    }
    if (user.roles && user.roles.indexOf('admin') > -1) {
      return true;
    }
    // check type video
    const photo = await this.photoModel.findById(query.photoId);
    if (!photo) throw new ForbiddenException();

    // check subscription
    const checkSubscribed = await this.subscriptionService.checkSubscribed(
      user._id
    );
    if (!checkSubscribed) {
      throw new ForbiddenException();
    }
    return true;
  }
}
