import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

export class OrderModel extends Document {
  // buyer information
  buyerId: ObjectId;

  buyerSource: string;

  orderNumber: string;

  type: string;

  status: string;

  quantity: number;

  totalPrice: number;

  originalPrice: number;

  deliveryStatus: string;

  deliveryAddress: string;

  phoneNumber: string;

  postalCode: string;

  sellerId: ObjectId;

  sellerSource: string;

  couponInfo: any;

  createdAt: Date;

  updatedAt: Date;

  username: string;
}
