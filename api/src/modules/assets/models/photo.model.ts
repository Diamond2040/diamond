import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

export class PhotoModel extends Document {
  target: string;

  targetId: ObjectId;

  fileId: ObjectId;

  type: string;

  title: string;

  description: string;

  status: string;

  processing: boolean;

  isCover: boolean;

  createdBy: ObjectId;

  updatedBy: ObjectId;

  createdAt: Date;

  updatedAt: Date;
}
