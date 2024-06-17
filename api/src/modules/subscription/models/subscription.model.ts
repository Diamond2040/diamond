import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

export class SubscriptionModel extends Document {
  subscriptionType?: string;

  userId: string | ObjectId;

  subscriptionId?: string;

  transactionId?: string | ObjectId;

  paymentGateway?: string;

  status?: string;

  meta?: any;

  startRecurringDate?: Date;

  nextRecurringDate?: Date;

  membershipType: string;

  currentPackageId: string | ObjectId;

  packageName: string;

  createdAt?: Date;

  updatedAt?: Date;

  expiredAt?: Date;
}
