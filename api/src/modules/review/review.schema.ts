import { Schema } from 'mongoose';
import { ObjectId } from 'mongodb';

export const schema = new Schema({
  source: String,
  sourceId: ObjectId,
  title: String,
  comment: String,
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  createdBy: {
    type: ObjectId,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});
