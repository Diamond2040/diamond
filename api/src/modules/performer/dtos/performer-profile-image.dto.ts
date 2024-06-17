import { pick } from 'lodash';
import { ObjectId } from 'mongodb';

export class PerformerProfileImageDto {
  _id: ObjectId;

  performerId: ObjectId;

  fileId: ObjectId;

  file: any;

  title: string;

  description: string;

  isMainImage: boolean;

  createdAt: Date;

  updatedAt: Date;

  fileUrl: string;

  constructor(data: Partial<PerformerProfileImageDto>) {
    Object.assign(
      this,
      pick(data, [
        '_id',
        'performerId',
        'fileId',
        'file',
        'title',
        'description',
        'isMainImage',
        'createdAt',
        'updatedAt'
      ])
    );
  }
}
