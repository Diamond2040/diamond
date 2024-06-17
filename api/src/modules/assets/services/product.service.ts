import {
  Injectable, Inject, forwardRef, HttpException
} from '@nestjs/common';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import {
  EntityNotFoundException, ForbiddenException, StringHelper
} from 'src/kernel';
import { FileDto } from 'src/modules/file';
import { UserDto } from 'src/modules/user/dtos';
import { FileService } from 'src/modules/file/services';
import {
  merge, uniq, pick, xor
} from 'lodash';
import { CheckPaymentService } from 'src/modules/payment/services';
import { AuthService } from 'src/modules/auth/services';
import { CategoryService } from 'src/modules/category/services';
import { isObjectId, toObjectId } from 'src/kernel/helpers/string.helper';
import { REF_TYPE } from 'src/modules/file/constants';
import { PRODUCT_TYPE } from '../constants';
import { ProductDto } from '../dtos';
import { ProductCreatePayload, ProductUpdatePayload } from '../payloads';
import { InvalidFileException } from '../exceptions';
import { ProductModel } from '../models';
import { PERFORMER_PRODUCT_MODEL_PROVIDER } from '../providers';

export const PERFORMER_PRODUCT_CHANNEL = 'PERFORMER_PRODUCT_CHANNEL';

@Injectable()
export class ProductService {
  constructor(
    @Inject(forwardRef(() => CategoryService))
    private readonly categoryService: CategoryService,
    @Inject(forwardRef(() => CheckPaymentService))
    private readonly checkPaymentService: CheckPaymentService,
    @Inject(PERFORMER_PRODUCT_MODEL_PROVIDER)
    private readonly productModel: Model<ProductModel>,
    private readonly authService: AuthService,
    private readonly fileService: FileService
  ) {}

  public async findByIds(ids: any) {
    const productIds = uniq((ids as any).map((i) => i.toString()));

    const products = await this.productModel
      .find({
        _id: {
          $in: productIds
        }
      })
      .lean()
      .exec();
    return products.map((p) => new ProductDto(p));
  }

  public async validatePhoto(photo: FileDto): Promise<any> {
    if (!photo.isImage()) {
      await this.fileService.remove(photo._id);
      throw new HttpException('Invalid photo file!', 422);
    }
    await this.fileService.queueProcessPhoto(photo._id, {
      thumbnailSize: {
        width: 500,
        height: 500
      }
    });

    return true;
  }

  public async create(
    payload: ProductCreatePayload,
    digitalFile: FileDto,
    creator?: UserDto
  ): Promise<ProductDto> {
    if (payload.type === PRODUCT_TYPE.DIGITAL && !digitalFile) {
      throw new InvalidFileException('Missing digital file');
    }
    // eslint-disable-next-line new-cap
    const product = new this.productModel(payload);
    if (digitalFile) product.digitalFileId = digitalFile._id;
    if (creator) {
      product.createdBy = creator._id;
      product.updatedBy = creator._id;
    }
    product.createdAt = new Date();
    product.updatedAt = new Date();
    product.slug = StringHelper.createAlias(payload.name);
    const slugCheck = await this.productModel.countDocuments({
      slug: product.slug
    });
    if (slugCheck) {
      product.slug = `${product.slug}-${StringHelper.randomString(8)}`;
    }
    await product.save();
    // add ref files
    product.imageIds && await Promise.all(product.imageIds.map((id) => this.fileService.addRef(id, { itemId: product._id, itemType: REF_TYPE.PRODUCT })));
    product.digitalFileId && await this.fileService.addRef(product.digitalFileId, { itemId: product._id, itemType: REF_TYPE.PRODUCT });
    const dto = new ProductDto(product);
    // await this.queueEventService.publish(
    //   new QueueEvent({
    //     channel: PERFORMER_PRODUCT_CHANNEL,
    //     eventName: EVENT.CREATED,
    //     data: dto
    //   })
    // );
    return dto;
  }

  public async update(
    id: string | ObjectId,
    payload: ProductUpdatePayload,
    digitalFile: FileDto,
    updater?: UserDto
  ): Promise<ProductDto> {
    const product = await this.productModel.findOne({ _id: id });
    if (!product) {
      throw new EntityNotFoundException();
    }
    // const oldStatus = product.status;
    if (payload.type === PRODUCT_TYPE.DIGITAL
      && !product.digitalFileId && !digitalFile
    ) {
      throw new InvalidFileException('Missing digital file');
    }
    let { slug } = product;
    if (payload.name !== product.name) {
      slug = StringHelper.createAlias(payload.name);
      const slugCheck = await this.productModel.countDocuments({
        slug,
        _id: { $ne: product._id }
      });
      if (slugCheck) {
        slug = `${slug}-${StringHelper.randomString(8)}`;
      }
    }
    merge(product, payload);
    product.categoryIds = payload.categoryIds || [];
    product.imageIds = payload.imageIds || [];
    product.slug = slug;
    if (digitalFile && `${digitalFile._id}` !== `${product?.digitalFileId}`) {
      // add ref
      await this.fileService.addRef(product.digitalFileId, { itemId: product._id, itemType: REF_TYPE.PRODUCT });
    }
    const deletedFileIds = [];
    if (payload.imageIds && payload.imageIds.length && product.imageIds) {
      // add ref
      const differentIds = xor(Array.isArray(payload.imageIds) ? payload.imageIds.map((imgId) => toObjectId(imgId)) : [toObjectId(payload.imageIds)], product.imageIds);
      differentIds && await Promise.all(differentIds.map((imgId) => this.fileService.addRef(imgId, { itemId: product._id, itemType: REF_TYPE.PRODUCT })));
    }
    if (digitalFile) {
      product.digitalFileId && deletedFileIds.push(product.digitalFileId);
      product.digitalFileId = digitalFile._id;
    }
    if (updater) product.updatedBy = updater._id;
    product.updatedAt = new Date();
    await product.save();
    deletedFileIds.length && (await Promise.all(deletedFileIds.map((fileId) => this.fileService.remove(fileId))));
    const dto = new ProductDto(product);
    // await this.queueEventService.publish(
    //   new QueueEvent({
    //     channel: PERFORMER_PRODUCT_CHANNEL,
    //     eventName: EVENT.UPDATED,
    //     data: {
    //       ...dto,
    //       oldStatus
    //     }
    //   })
    // );
    return dto;
  }

  public async delete(id: string | ObjectId): Promise<boolean> {
    const product = await this.productModel.findOne({ _id: id });
    if (!product) {
      throw new EntityNotFoundException();
    }

    await product.remove();
    product.digitalFileId && (await this.fileService.remove(product.digitalFileId));
    product.imageIds && await Promise.all(product.imageIds.map((fileId) => this.fileService.remove(fileId)));

    // await this.queueEventService.publish(
    //   new QueueEvent({
    //     channel: PERFORMER_PRODUCT_CHANNEL,
    //     eventName: EVENT.DELETED,
    //     data: new ProductDto(product)
    //   })
    // );
    return true;
  }

  public async getDetails(id: string | ObjectId) {
    const query = !isObjectId(`${id}`) ? { slug: id } : { _id: id } as any;
    const product = await this.productModel.findOne(query);
    if (!product) {
      throw new EntityNotFoundException();
    }

    const [images] = await Promise.all([
      product.imageIds ? this.fileService.findByIds(product.imageIds) : []
    ]);

    const dto = new ProductDto(product);
    dto.images = images.length ? images.map((image) => ({
      ...image,
      url: image.getUrl(),
      thumbnails: image.getThumbnails()
    })) : [];

    if (product.categoryIds?.length) {
      dto.categories = await this.categoryService.findByIds(product.categoryIds);
    }
    await this.productModel.updateOne({ _id: product._id }, { $inc: { 'stats.views': 1 } });
    return dto;
  }

  public async updateStock(id: string | ObjectId, num = -1) {
    return this.productModel.updateOne(
      { _id: id },
      { $inc: { stock: num } }
    );
  }

  public async updateCommentStats(id: string | ObjectId, num = 1) {
    return this.productModel.updateOne(
      { _id: id },
      {
        $inc: { 'stats.comments': num }
      }
    );
  }

  public async checkAuth(req: any, user: UserDto) {
    const { query } = req;
    if (!query.productId) {
      throw new ForbiddenException();
    }
    if (user.roles && user.roles.indexOf('admin') > -1) {
      return true;
    }
    // check type product
    const product = await this.productModel.findById(query.productId);
    if (!product) throw new EntityNotFoundException();
    if (product.type === PRODUCT_TYPE.PHYSICAL) {
      return true;
    }
    // check bought
    const bought = await this.checkPaymentService.checkBoughtProduct(new ProductDto(product), user);
    if (!bought) {
      throw new ForbiddenException();
    }
    return true;
  }

  public async generateDownloadLink(productId, userId) {
    const product = await this.productModel.findById(productId);
    if (!product.digitalFileId) throw new EntityNotFoundException();
    const file = await this.fileService.findById(product.digitalFileId);
    if (!file) throw new EntityNotFoundException();

    const auth = await this.authService.findBySource({ source: 'user', type: 'email', sourceId: userId })
      || await this.authService.findBySource({ source: 'user', type: 'username', sourceId: userId });
    const jwToken = this.authService.generateJWT(pick(auth, ['_id', 'source', 'sourceId']), { expiresIn: 3 * 60 * 60 });
    // TODO - should change with header download link
    return `${new FileDto(file).getUrl()}?productId=${product._id}&token=${jwToken}`;
  }
}
