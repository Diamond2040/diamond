import { Document } from 'mongoose';

export class CustomAttributeModel extends Document {
  key: string;

  description: string;

  value: any;

  group: string;

  createdAt: Date;

  updatedAt: Date;
}
