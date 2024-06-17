import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';

export class UserBookingNotificationModel extends Document {
  userId: ObjectId;

  itemId: ObjectId;

  performerId: ObjectId;

  createdAt: Date;

  updatedAt: Date;
}
