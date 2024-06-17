import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

export class ScheduleModel extends Document {
  _id: ObjectId;

  userId: ObjectId;

  name: string;

  price: number;

  description: string;

  status: string;

  isBooked: boolean;

  startAt: Date;

  endAt: Date;

  createdAt: Date;

  updatedAt: Date;
}
