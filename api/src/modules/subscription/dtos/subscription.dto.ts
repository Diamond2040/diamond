import { ObjectId } from 'mongodb';
import { pick } from 'lodash';
import { UserDto } from 'src/modules/user/dtos';

export interface ISubscriptionResponse {
  _id?: string | ObjectId;
  subscriptionType?: string;
  userId?: string | ObjectId;
  subscriptionId?: string;
  transactionId?: string | ObjectId;
  paymentGateway?: string;
  status?: string;
  meta?: any;
  startRecurringDate?: Date;
  nextRecurringDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  expiredAt?: Date;
  userInfo?: UserDto;
  membershipType: string;
}

export class SubscriptionDto {
  _id?: string | ObjectId;

  subscriptionType?: string;

  userId?: string | ObjectId;

  subscriptionId?: string;

  transactionId?: string | ObjectId;

  paymentGateway?: string;

  status?: string;

  meta?: any;

  startRecurringDate?: Date;

  nextRecurringDate?: Date;

  createdAt?: Date;

  updatedAt?: Date;

  expiredAt?: Date;

  userInfo?: UserDto;

  membershipType?: string;

  packageName?: string;

  currentPackageId?: string | ObjectId;

  constructor(data?: Partial<SubscriptionDto>) {
    Object.assign(
      this,
      pick(data, [
        '_id',
        'subscriptionType',
        'userInfo',
        'userId',
        'subscriptionId',
        'transactionId',
        'paymentGateway',
        'status',
        'meta',
        'startRecurringDate',
        'nextRecurringDate',
        'expiredAt',
        'createdAt',
        'updatedAt',
        'blockedUser',
        'membershipType',
        'packageName'
      ])
    );
  }

  toResponse(includePrivateInfo = false) {
    const publicInfo = {
      _id: this._id,
      subscriptionType: this.subscriptionType,
      userId: this.userId,
      userInfo: this.userInfo,
      status: this.status,
      expiredAt: this.expiredAt,
      startRecurringDate: this.startRecurringDate,
      nextRecurringDate: this.nextRecurringDate,
      paymentGateway: this.paymentGateway
    };

    const privateInfo = {
      subscriptionId: this.subscriptionId,
      transactionId: this.transactionId,
      meta: this.meta,
      membershipType: this.membershipType,
      packageName: this.packageName,
      currentPackageId: this.currentPackageId
    };
    if (!includePrivateInfo) {
      return publicInfo;
    }

    return { ...publicInfo, ...privateInfo };
  }
}
