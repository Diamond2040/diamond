import { Schema } from 'mongoose';

export const CustomAttributeSchema = new Schema({
  key: {
    type: String,
    index: true
  },
  value: {
    type: Schema.Types.Mixed
  },
  description: {
    type: String
  },
  group: {
    type: String,
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
}, {
  collection: 'customAttributes'
});
