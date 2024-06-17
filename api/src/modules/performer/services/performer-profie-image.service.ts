import { Inject, Injectable } from '@nestjs/common';
import { FileDto } from 'src/modules/file';
import { ObjectId } from 'mongodb';
import { FilterQuery, Model } from 'mongoose';
import { EntityNotFoundException, PageableData } from 'src/kernel';
import { FileService } from 'src/modules/file/services';
import { InvalidImageException } from 'src/modules/file/exceptions';
import { toObjectId } from 'src/kernel/helpers/string.helper';
import { PerformerProfileImageDto } from '../dtos';
import { PERFORMER_PROFILE_IMAGE_MODEL_PROVIDER } from '../providers';
import { PerformerProfileImageModel } from '../models';
import {
  UpdatePerformerProfileImagePayload,
  UploadPerformerProfileImagePayload,
  SearchPerformerProfileImagePayload
} from '../payloads';
import { PerformerService } from './performer.service';

@Injectable()
export class PerformerProfileImageService {
  constructor(
    @Inject(PERFORMER_PROFILE_IMAGE_MODEL_PROVIDER)
    private readonly PerformerProfileImage: Model<PerformerProfileImageModel>,
    private readonly performerService: PerformerService,
    private readonly fileService: FileService
  ) {}

  async upload(
    file: FileDto,
    payload: UploadPerformerProfileImagePayload
  ): Promise<PerformerProfileImageDto> {
    if (!file) {
      throw new InvalidImageException();
    }

    const performer = await this.performerService.findById(payload.performerId);
    if (!performer) {
      throw new EntityNotFoundException();
    }

    const image = await this.PerformerProfileImage.create({
      performerId: payload.performerId,
      fileId: file._id,
      title: payload.title
    });

    await this.fileService.addRef(file._id, {
      itemId: image._id,
      itemType: 'performer-profile-image'
    });

    if (!performer.avatarId) {
      await this.performerService.updateAvatar(performer, file);
      image.isMainImage = true;
      await image.save();
    }

    return new PerformerProfileImageDto(image);
  }

  async update(
    id: string | ObjectId,
    file: FileDto,
    payload: UpdatePerformerProfileImagePayload
  ) {
    const image = await this.PerformerProfileImage.findById(id);
    if (!image) {
      if (file) {
        this.fileService.remove(file._id);
      }

      throw new EntityNotFoundException();
    }

    const { fileId } = image;
    if (payload.title) image.title = payload.title;
    if (file) image.fileId = file._id;
    if (payload.performerId) {
      image.performerId = toObjectId(payload.performerId);
    }

    await image.save();
    if (file) {
      await Promise.all([
        this.fileService.addRef(file._id, {
          itemId: image._id,
          itemType: 'performer-profile-image'
        }),
        this.fileService.remove(fileId)
      ]);
    }

    return true;
  }

  async delete(id: string) {
    const image = await this.PerformerProfileImage.findById(id);
    if (!image) {
      throw new EntityNotFoundException();
    }

    await image.remove();
    await this.fileService.remove(image.fileId);

    if (image.isMainImage) {
      const item = await this.PerformerProfileImage.findOne({
        performerId: image.performerId
      });
      if (item) {
        await this.setAvatar(image.performerId, image);
      }
    }
  }

  public async findOne(id: string | ObjectId): Promise<PerformerProfileImageDto> {
    const image = await this.PerformerProfileImage.findById(id);
    if (!image) {
      throw new EntityNotFoundException();
    }

    const file = await this.fileService.findById(image.fileId);

    return new PerformerProfileImageDto({
      ...image.toObject(),
      file: file.toResponse()
    });
  }

  async search(
    req: SearchPerformerProfileImagePayload
  ): Promise<PageableData<PerformerProfileImageDto>> {
    const query: FilterQuery<PerformerProfileImageModel> = {};
    if (req.performerId) query.performerId = toObjectId(req.performerId);

    const sort = {
      [req.sortBy || 'updatedAt']: req.sort || 'desc'
    };

    const [results, total] = await Promise.all([
      this.PerformerProfileImage
        .find(query)
        .sort(sort)
        .limit(parseInt(req.limit as string, 10))
        .skip(parseInt(req.offset as string, 10))
        .lean(),
      this.PerformerProfileImage.countDocuments(query)
    ]);

    const fileIds = results.map((d) => d.fileId);
    const files = await this.fileService.findByIds(fileIds);

    return {
      total,
      data: results.map((data) => {
        const file = files.find((f) => f._id.equals(data.fileId));

        return new PerformerProfileImageDto({
          ...data,
          file: file.toResponse()
        });
      })
    };
  }

  async setAvatar(performerId: string | ObjectId, imageId) {
    const image = await this.PerformerProfileImage.findById(imageId);
    if (!image) {
      throw new EntityNotFoundException();
    }

    const [file, performer] = await Promise.all([
      this.fileService.findById(image.fileId),
      this.performerService.findById(performerId)
    ]);

    if (!file || !performer) throw new EntityNotFoundException();

    await this.performerService.updateAvatar(performer, file);
    image.isMainImage = true;
    await image.save();
    // remove old data
    await this.PerformerProfileImage.updateMany({
      performerId: performer._id,
      _id: {
        $ne: image._id
      }
    }, {
      $set: {
        isMainImage: false
      }
    });

    return true;
  }

  async getAllPerformerImages(performerId: string | ObjectId) {
    const results = await this.PerformerProfileImage.find({
      performerId
    }).lean();
    const fileIds = results.map((d) => d.fileId);
    const files = await this.fileService.findByIds(fileIds);

    return results.map((data) => {
      const file = files.find((f) => f._id.equals(data.fileId));

      return new PerformerProfileImageDto({
        ...data,
        file: file.toResponse()
      });
    });
  }
}
