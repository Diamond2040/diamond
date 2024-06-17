import { Schema } from 'mongoose';
import { ObjectId } from 'mongodb';

export const ServiceSettingSchema = new Schema({
  performerId: {
    type: ObjectId,
    index: true
  },
  group: String,

  settings: [{
    _id: false,
    service: String,
    time: String,
    include: {
      type: String,
      default: 'y'
    },
    price: {
      type: Number,
      default: null
    }
  }],

  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});
