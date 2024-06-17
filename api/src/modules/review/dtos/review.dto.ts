import { Expose } from 'class-transformer';
import { ObjectId } from 'mongodb';
import { ReviewSourceType } from '../interfaces';

export class ReviewDto {
  @Expose()
  _id: ObjectId;

  @Expose()
  source: ReviewSourceType;

  @Expose()
  sourceId: ObjectId;

  @Expose()
  sourceInfo: any;

  @Expose()
  title: string;

  @Expose()
  comment: string;

  @Expose()
  rating: number;

  @Expose()
  createdBy: ObjectId;

  @Expose()
  reviewer: any;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
