import { IUser } from './user';

export interface Review {
  _id: string;

  source: string;

  sourceId: string;

  title: string;

  comment: string;

  rating: number;

  createdBy: string;

  reviewer: IUser;

  createdAt: Date;

  updatedAt: Date;
}
