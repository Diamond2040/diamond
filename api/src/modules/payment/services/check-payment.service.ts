import { Injectable, Inject } from '@nestjs/common';
import { UserDto } from 'src/modules/user/dtos';
import { EntityNotFoundException } from 'src/kernel';
import { Model } from 'mongoose';
import { ProductDto, VideoDto } from 'src/modules/assets/dtos';
import { ORDER_DETAIL_MODEL_PROVIDER } from '../providers';
import { OrderDetailsModel } from '../models';
import {
  ORDER_STATUS
} from '../constants';

@Injectable()
export class CheckPaymentService {
  constructor(
    @Inject(ORDER_DETAIL_MODEL_PROVIDER)
    private readonly orderDetailsModel: Model<OrderDetailsModel>
  ) { }

  public checkBoughtVideo = async (video: VideoDto, user: UserDto) => this.orderDetailsModel.countDocuments({
    status: ORDER_STATUS.PAID,
    productId: video._id,
    buyerId: user._id
  })

  public async checkBoughtProduct(product: ProductDto, user: UserDto) {
    if (!product || (product && !product.price)) {
      throw new EntityNotFoundException();
    }
    return this.orderDetailsModel.countDocuments({
      status: ORDER_STATUS.PAID,
      productId: product._id,
      buyerId: user._id
    });
  }
}
