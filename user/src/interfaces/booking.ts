import { IPerformer } from './performer';
import { IUser } from './user';

export interface Booking {
  _id: string;

  fromSourceId: string;

  fromSource: string;

  sourceInfo: IUser;

  targetId: string;

  targetInfo: IPerformer;

  dataInfo: any;

  scheduleId: string;

  scheduleInfo: any;

  duration: number;

  message: string;

  startAt: Date;

  status: string;

  createdAt: Date;

  updatedAt: Date;
}

export const BOOKING_STATUS = {
  REJECT: 'reject',
  CREATED: 'created',
  PAID: 'paid'
};
