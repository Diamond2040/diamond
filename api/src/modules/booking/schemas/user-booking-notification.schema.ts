import { ObjectId } from 'mongodb';
import { Schema } from 'mongoose';

export const UserBookingNotification = new Schema({
  userId: {
    type: ObjectId,
    index: true
  },
  itemId: ObjectId,
  performerId: ObjectId,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});
