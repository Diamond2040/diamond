import { Schema } from 'mongoose';
import { ObjectId } from 'mongodb';

export const CategorySchema = new Schema({
  group: {
    type: String,
    index: true
  },
  name: {
    type: String,
    trim: true
    // TODO - text index?
  },
  slug: {
    type: String,
    index: true,
    trim: true
  },
  description: String,
  status: {
    type: String,
    default: 'active'
  },
  ordering: {
    type: Number,
    default: 0
  },
  createdBy: ObjectId,
  updatedBy: ObjectId,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  collection: 'categories'
});
