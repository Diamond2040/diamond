import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

export class BookingModel extends Document {
  fromSourceId: ObjectId;

  targetId: ObjectId;

  scheduleId: ObjectId;

  duration: number;

  message: string;

  startAt: Date;

  status: string;

  createdAt: Date;

  updatedAt: Date;
}
