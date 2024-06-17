import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

export class PerformerProfileImageModel extends Document {
  performerId: ObjectId;

  isMainImage: boolean;

  fileId: ObjectId;

  title: string;

  description: string;

  createdAt: Date;

  updatedAt: Date;
}
