import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';
import { AbuseReportType } from '../dtos';

export class AbuseReportModel extends Document {
  _id?: ObjectId;

  sourceId: ObjectId;

  targetId: ObjectId;

  type: AbuseReportType;

  category: string;

  comment: string;

  createdAt?: Date;

  updatedAt?: Date;
}
