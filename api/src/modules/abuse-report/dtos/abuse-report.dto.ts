import { pick } from 'lodash';
import { ObjectId } from 'mongodb';
import { AbuseReportModel } from '../models';

export type AbuseReportType = 'model' | 'video';

export interface AbuseReport {
  [T: string]: {
    _id: string | ObjectId;
    text: string;
    senderSource: string;
    senderId: string | ObjectId;
    senderInfo?: any;
    createdAt: Date;
  };
}

export type AbuseReportResponse = {
  _id?: ObjectId;

  sourceId: ObjectId;

  sourceInfo?: any;

  targetId: ObjectId;

  targetInfo?: any;

  type : AbuseReportType;

  category: string;

  comment: string;

  createdAt?: Date;

  updatedAt?: Date;
};

export class AbuseReportDto {
  _id?: ObjectId;

  sourceId: ObjectId;

  sourceInfo?: any;

  targetId: ObjectId;

  targetInfo?: any;

  category: string;

  type : AbuseReportType;

  comment: string;

  createdAt?: Date;

  updatedAt?: Date;

  constructor(data: AbuseReportResponse | AbuseReportModel) {
    Object.assign(
      this,
      pick(data, [
        '_id',
        'sourceId',
        'sourceInfo',
        'targetId',
        'targetInfo',
        'category',
        'type',
        'comment',
        'createdAt',
        'updatedAt'
      ])
    );
  }

  toResponse(): AbuseReportResponse {
    return {
      _id: this._id,
      sourceId: this.sourceId,
      sourceInfo: this.sourceInfo,
      targetId: this.targetId,
      targetInfo: this.targetInfo,
      category: this.category,
      type: this.type,
      comment: this.comment,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
