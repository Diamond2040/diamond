import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';
import { ReviewSourceType } from './interfaces';

export class Review extends Document {
  source: ReviewSourceType;

  sourceId: ObjectId | string;

  title: string;

  comment: string;

  rating: number;

  createdBy: ObjectId;

  createdAt: Date;

  updatedAt: Date;
}
