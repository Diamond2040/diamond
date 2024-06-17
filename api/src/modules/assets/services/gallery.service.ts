import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { Model } from 'mongoose';
import { merge } from 'lodash';
import {
  EntityNotFoundException, PageableData, QueueEvent, QueueEventService, StringHelper
} from 'src/kernel';
import { PerformerService } from 'src/modules/performer/services';
import { UserDto } from 'src/modules/user/dtos';
import { ObjectId } from 'mongodb';

import { FileService } from 'src/modules/file/services';
import { PerformerDto } from 'src/modules/performer/dtos';
import { EVENT, STATUS } from 'src/kernel/constants';
import { isObjectId } from 'src/kernel/helpers/string.helper';
import { CategoryService } from 'src/modules/category/services';
import { GalleryUpdatePayload } from '../payloads/gallery-update.payload';
import { GalleryDto } from '../dtos';
import { GalleryCreatePayload, GallerySearchRequest } from '../payloads';
import { GalleryModel, PhotoModel } from '../models';
import {
  PERFORMER_GALLERY_MODEL_PROVIDER,
  PERFORMER_PHOTO_MODEL_PROVIDER
} from '../providers';
import { PhotoService } from './photo.service';

export const PERFORMER_GALLERY_CHANNEL = 'PERFORMER_GALLERY_CHANNEL';

@Injectable()
export class GalleryService {
  constructor(
    @Inject(forwardRef(() => CategoryService))
    private readonly categoryService: CategoryService,
    @Inject(forwardRef(() => PerformerService))
    private readonly performerService: PerformerService,
    @Inject(PERFORMER_GALLERY_MODEL_PROVIDER)
    private readonly galleryModel: Model<GalleryModel>,
    @Inject(PERFORMER_PHOTO_MODEL_PROVIDER)
    private readonly photoModel: Model<PhotoModel>,
    private readonly fileService: FileService,
    private readonly queueEventService: QueueEventService,
    @Inject(forwardRef(() => PhotoService))
    private readonly photoService: PhotoService
  ) {}

  public async create(
    payload: GalleryCreatePayload,
    creator?: UserDto
  ): Promise<GalleryDto> {
    // eslint-disable-next-line new-cap
    const model = new this.galleryModel(payload);
    model.createdAt = new Date();
    model.updatedAt = new Date();
    if (creator) {
      model.createdBy = creator._id;
      model.updatedBy = creator._id;
    }
    model.slug = StringHelper.createAlias(payload.name);
    const slugCheck = await this.galleryModel.countDocuments({
      slug: model.slug
    });
    if (slugCheck) {
      model.slug = `${model.slug}-${StringHelper.randomString(8)}`;
    }
    await model.save();
    // update performer stats
    await this.queueEventService.publish(
      new QueueEvent({
        channel: PERFORMER_GALLERY_CHANNEL,
        eventName: EVENT.CREATED,
        data: {
          ...new GalleryDto(model)
        }
      })
    );
    return GalleryDto.fromModel(model);
  }

  public async update(
    id: string | ObjectId,
    payload: GalleryUpdatePayload,
    creator?: UserDto
  ): Promise<GalleryDto> {
    const gallery = await this.galleryModel.findById(id);
    if (!gallery) {
      throw new EntityNotFoundException('Gallery not found!');
    }
    let { slug } = gallery;
    if (payload.name !== gallery.name) {
      slug = StringHelper.createAlias(payload.name);
      const slugCheck = await this.galleryModel.countDocuments({
        slug,
        _id: { $ne: gallery._id }
      });
      if (slugCheck) {
        slug = `${slug}-${StringHelper.randomString(8)}`;
      }
    }
    merge(gallery, payload);
    gallery.slug = slug;
    gallery.performerIds = payload.performerIds || [];
    gallery.categoryIds = payload.categoryIds || [];
    gallery.updatedAt = new Date();
    if (creator) {
      gallery.updatedBy = creator._id;
    }
    const oldStatus = gallery.status;
    await gallery.save();
    // update performer stats
    await this.queueEventService.publish(
      new QueueEvent({
        channel: PERFORMER_GALLERY_CHANNEL,
        eventName: EVENT.UPDATED,
        data: {
          ...new GalleryDto(gallery),
          oldStatus
        }
      })
    );
    return GalleryDto.fromModel(gallery);
  }

  public async findByIds(ids: string[] | ObjectId[]): Promise<GalleryDto[]> {
    const galleries = await this.galleryModel.find({
      _id: {
        $in: ids
      }
    });

    return galleries.map((g) => new GalleryDto(g));
  }

  public async findById(id: string | ObjectId): Promise<GalleryDto> {
    const gallery = await this.galleryModel.findOne({ _id: id });
    if (!gallery) {
      throw new EntityNotFoundException();
    }
    return new GalleryDto(gallery);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async details(id: string | ObjectId, user: UserDto) {
    const query = !isObjectId(`${id}`) ? { slug: id } : { _id: id } as any;
    const gallery = await this.galleryModel.findOne(query);
    if (!gallery) {
      throw new EntityNotFoundException();
    }

    const dto = new GalleryDto(gallery);
    if (gallery.performerIds && gallery.performerIds.length) {
      const performers = await this.performerService.findByIds(gallery.performerIds);
      dto.performers = performers.map((p) => new PerformerDto(p).toPublicDetailsResponse());
    }
    if (gallery.categoryIds && gallery.categoryIds.length) {
      const categories = await this.categoryService.findByIds(gallery.categoryIds);
      dto.categories = categories;
    }

    await this.galleryModel.updateOne({ _id: gallery._id }, { $inc: { 'stats.views': 1 } });
    return new GalleryDto(gallery);
  }

  public async adminSearch(
    req: GallerySearchRequest
  ): Promise<PageableData<GalleryDto>> {
    const query = {} as any;
    if (req.q) {
      const searchValue = { $regex: new RegExp(req.q.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''), 'i') };
      query.$or = [
        { name: searchValue },
        { slug: searchValue },
        { description: searchValue }
      ];
    }
    if (req.performerId) query.performerIds = { $in: [req.performerId] };
    if (req.performerIds && req.performerIds.length) {
      query.performerIds = Array.isArray(req.performerIds) ? { $in: req.performerIds } : { $in: [req.performerIds] };
    }
    if (req.categoryId) {
      query.categoryIds = { $in: [req.categoryId] };
    }
    if (req.categoryIds && req.categoryIds.length) {
      query.categoryIds = Array.isArray(req.categoryIds) ? { $in: req.categoryIds } : { $in: [req.categoryIds] };
    }
    if (req.status) query.status = req.status;
    let sort = {};
    if (req.sort && req.sortBy) {
      sort = {
        [req.sortBy]: req.sort
      };
    }
    const [data, total] = await Promise.all([
      this.galleryModel
        .find(query)
        .lean()
        .sort(sort)
        .limit(req.limit ? parseInt(req.limit as string, 10) : 10)
        .skip(parseInt(req.offset as string, 10)),
      this.galleryModel.countDocuments(query)
    ]);

    const performerIds = [];
    data.forEach((d) => {
      if (d.performerIds?.length) performerIds.push(...d.performerIds);
    });
    const galleries = data.map((g) => new GalleryDto(g));
    const coverPhotoIds = data.map((d) => d.coverPhotoId);

    const [performers, coverPhotos] = await Promise.all([
      performerIds.length ? this.performerService.findByIds(performerIds) : [],
      coverPhotoIds.length
        ? this.photoModel
          .find({ _id: { $in: coverPhotoIds } })
          .lean()
          .exec()
        : []
    ]);
    const fileIds = coverPhotos.map((c) => c.fileId);
    const files = await this.fileService.findByIds(fileIds);

    galleries.forEach((g) => {
      const performerIdsString = g.performerIds?.map((id) => id.toString()) || [];
      const gPerformers = performers.filter(
        (p) => performerIdsString.includes(p._id.toString())
      );
      // eslint-disable-next-line no-param-reassign
      g.performers = gPerformers.map((p) => new PerformerDto(p).toPublicDetailsResponse());
      if (g.coverPhotoId) {
        const coverPhoto = coverPhotos.find(
          (c) => c._id.toString() === g.coverPhotoId.toString()
        );
        if (coverPhoto) {
          const file = files.find(
            (f) => f._id.toString() === coverPhoto.fileId.toString()
          );
          if (file) {
            // eslint-disable-next-line no-param-reassign
            g.coverPhoto = {
              url: file.getUrl(),
              thumbnails: file.getThumbnails()
            };
          }
        }
      }
    });

    return {
      data: galleries,
      total
    };
  }

  public async userSearch(
    req: GallerySearchRequest,
    jwToken: string
  ): Promise<PageableData<GalleryDto>> {
    const query = {
      status: STATUS.ACTIVE,
      numOfItems: { $gt: 0 }
    } as any;
    if (req.q) {
      const searchValue = { $regex: new RegExp(req.q.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''), 'i') };
      query.$or = [
        { name: searchValue },
        { slug: searchValue },
        { description: searchValue }
      ];
    }
    if (req.excludedId) query._id = { $ne: req.excludedId };
    if (req.performerId) query.performerIds = { $in: [req.performerId] };
    if (req.performerIds && req.performerIds.length) query.performerIds = { $in: req.performerIds };
    if (req.categoryId) {
      query.categoryIds = { $in: [req.categoryId] };
    }
    if (req.categoryIds && req.categoryIds.length) {
      query.categoryIds = { $in: req.categoryIds };
    }
    let sort = {};
    if (req.sort && req.sortBy) {
      sort = {
        [req.sortBy]: req.sort
      };
    }
    const [data, total] = await Promise.all([
      this.galleryModel
        .find(query)
        .lean()
        .sort(sort)
        .limit(req.limit ? parseInt(req.limit as string, 10) : 10)
        .skip(parseInt(req.offset as string, 10)),
      this.galleryModel.countDocuments(query)
    ]);

    const performerIds = [];
    data.forEach((d) => {
      if (d.performerIds?.length) performerIds.push(...d.performerIds);
    });
    const galleries = data.map((g) => new GalleryDto(g));
    const coverPhotoIds = data.map((d) => d.coverPhotoId);

    const [performers, coverPhotos] = await Promise.all([
      performerIds.length ? this.performerService.findByIds(performerIds) : [],
      coverPhotoIds.length
        ? this.photoModel
          .find({ _id: { $in: coverPhotoIds } })
          .lean()
          .exec()
        : []
    ]);
    const fileIds = coverPhotos.map((c) => c.fileId);
    const files = await this.fileService.findByIds(fileIds);

    galleries.forEach((g) => {
      const performerIdsString = g.performerIds?.map((id) => id.toString()) || [];
      const gPerformers = performers.filter(
        (p) => performerIdsString.includes(p._id.toString())
      );
      // eslint-disable-next-line no-param-reassign
      g.performers = gPerformers.map((p) => new PerformerDto(p).toPublicDetailsResponse());
      if (g.coverPhotoId) {
        const coverPhoto = coverPhotos.find(
          (c) => c._id.toString() === g.coverPhotoId.toString()
        );
        if (coverPhoto) {
          const file = files.find(
            (f) => f._id.toString() === coverPhoto.fileId.toString()
          );
          if (file) {
            const url = file.getUrl();
            // eslint-disable-next-line no-param-reassign
            g.coverPhoto = {
              url: jwToken ? `${url}?photoId=${coverPhoto._id}&token=${jwToken}` : null,
              thumbnails: file.getThumbnails()
            };
          }
        }
      }
    });

    return {
      data: galleries,
      total
    };
  }

  public async updateCover(
    galleryId: string | ObjectId,
    photoId: ObjectId
  ): Promise<boolean> {
    await this.galleryModel.updateOne(
      { _id: galleryId },
      {
        coverPhotoId: photoId
      }
    );
    return true;
  }

  public async updateCommentStats(id: string | ObjectId, num = 1) {
    return this.galleryModel.updateOne(
      { _id: id },
      {
        $inc: { 'stats.comments': num }
      }
    );
  }

  public async updatePhotoStats(id: string | ObjectId, num = 1) {
    return this.galleryModel.updateOne(
      { _id: id },
      {
        $inc: { numOfItems: num }
      }
    );
  }

  public async delete(id: string | ObjectId) {
    const gallery = await this.galleryModel.findById(id);
    if (!gallery) {
      throw new EntityNotFoundException();
    }
    await gallery.remove();
    await this.photoService.deleteByGallery(gallery._id);
    await this.queueEventService.publish(
      new QueueEvent({
        channel: PERFORMER_GALLERY_CHANNEL,
        eventName: EVENT.DELETED,
        data: {
          ...new GalleryDto(gallery)
        }
      })
    );
    return true;
  }
}
