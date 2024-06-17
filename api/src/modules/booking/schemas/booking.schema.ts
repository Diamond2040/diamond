import { Schema } from 'mongoose';
import { BOOKING_STATUS } from '../constants';

export const BookingSchema = new Schema({
  fromSourceId: {
    type: Schema.Types.ObjectId,
    index: true
  },
  duration: {
    type: Number,
    default: 0
  },
  message: String,
  startAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: BOOKING_STATUS.CREATED
  },
  scheduleId: { type: Schema.Types.ObjectId, index: true },
  targetId: { type: Schema.Types.ObjectId, index: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
