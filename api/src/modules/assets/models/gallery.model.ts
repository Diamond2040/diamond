import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

export class GalleryModel extends Document {
  performerIds: ObjectId[];

  categoryIds: ObjectId[];

  type: string;

  name: string;

  slug: string;

  description: string;

  status: string;

  coverPhotoId: ObjectId;

  stats: {
    views: number;
    favourites: number;
    wishlist: number;
    comments: number;
  };

  isSale: boolean;

  price: number;

  numOfItems: number;

  createdBy: ObjectId;

  updatedBy: ObjectId;

  createdAt: Date;

  updatedAt: Date;
}
