import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

export interface IServiceSetting {
  service: string;

  time: string;

  include: string;

  price?: number;
}

export class ServiceSettingModel extends Document {
  performerId: string | ObjectId;

  group: string;

  settings: IServiceSetting[];

  createdAt: Date;

  updatedAt: Date;
}
