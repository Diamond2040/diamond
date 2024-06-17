import { ObjectId } from 'mongodb';
import { pick } from 'lodash';
import { IUserResponse } from 'src/modules/user/dtos';

export class BookingDto {
  _id: ObjectId;

  fromSourceId: ObjectId;

  sourceInfo: IUserResponse;

  targetId: ObjectId;

  targetInfo: any;

  scheduleId: ObjectId;

  scheduleInfo: any;

  duration: number;

  message: string;

  startAt: Date;

  status: string;

  createdAt: Date;

  updatedAt: Date;

  constructor(data: Partial<BookingDto>) {
    Object.assign(
      this,
      pick(data, [
        '_id',
        'fromSourceId',
        'sourceInfo',
        'targetId',
        'targetInfo',
        'scheduleId',
        'scheduleInfo',
        'duration',
        'startAt',
        'message',
        'status',
        'createdAt',
        'updatedAt'
      ])
    );
  }
}
