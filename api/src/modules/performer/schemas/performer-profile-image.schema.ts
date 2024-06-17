import { Schema } from 'mongoose';
import { ObjectId } from 'mongodb';

export const PerformerProfileImageSchema = new Schema({
  performerId: {
    type: ObjectId,
    index: true
  },
  title: String,
  description: String,
  fileId: ObjectId,
  isMainImage: {
    type: Boolean,
    default: false
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
