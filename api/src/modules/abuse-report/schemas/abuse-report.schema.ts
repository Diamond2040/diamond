import { ObjectId } from 'mongodb';
import { Schema } from 'mongoose';
import {
  ABUSE_REPORT_CATEGORY_LIST, ABUSE_REPORT_CATEGORIES, ABUSE_REPORT_TYPES, ABUSE_REPORT_TYPE_LIST
} from '../constant';

export const abuseReportSchema = new Schema({
  sourceId: ObjectId,
  targetId: {
    type: ObjectId,
    index: true
  },
  type: {
    type: String,
    enum: ABUSE_REPORT_TYPE_LIST,
    default: ABUSE_REPORT_TYPES.CHAT
  },
  category: {
    type: String,
    enum: ABUSE_REPORT_CATEGORY_LIST,
    default: ABUSE_REPORT_CATEGORIES.OTHER
  },
  comment: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});
