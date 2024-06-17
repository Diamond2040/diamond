import { ObjectId } from 'mongodb';
import { Schema } from 'mongoose';
import { STATUS } from 'src/kernel/constants';

export const scheduleSchema = new Schema({
  name: {
    type: String
  },
  userId: {
    type: ObjectId,
    index: true
  },
  price: {
    type: Number,
    min: 0,
    default: 0
  },
  description: {
    type: String
  },
  status: {
    type: String,
    default: STATUS.ACTIVE
  },
  isBooked: {
    type: Boolean,
    default: false
  },
  startAt: { type: Date, default: Date.now },
  endAt: { type: Date, default: Date.now },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});
