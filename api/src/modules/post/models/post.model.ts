import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

export class PostModel extends Document {
  authorId: ObjectId;

  type = 'post';

  title: string;

  slug: string;

  ordering: number;

  content: string;

  shortDescription: string;

  categoryIds: string[] = [];

  // store all related categories such as parent ids int search filter
  categorySearchIds?: string[] = [];

  status = 'draft';

  imageId: string | ObjectId;

  image?: string;

  updatedBy?: ObjectId;

  createdBy?: ObjectId;

  createdAt: Date;

  updatedAt: Date;
}
