import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

export class PerformerModel extends Document {
  userId: string | ObjectId;

  name: string;

  firstName: string;

  lastName: string;

  username: string;

  email: string;

  phone: string;

  phoneCode: string; // international code prefix

  avatarId: ObjectId;

  avatarPath: string;

  gender: string;

  country: string;

  city: string;

  state: string;

  zipcode: string;

  address: string;

  languages: string[];

  categoryIds: ObjectId[];

  height: string;

  weight: string;

  bio: string;

  eyes: string;

  pubicHair: string;

  hair: string;

  bodyType: string;

  ethnicity: string;

  dateOfBirth: Date;

  stats: {
    likes: number;
    views: number;
    totalRates: number;
    avgRates: number;
    numRates: number;
  };

  // score custom from other info like likes, subscribes, views....
  score: number;

  createdBy: ObjectId;

  createdAt: Date;

  updatedAt: Date;

  welcomeVideoId: ObjectId;

  welcomeVideoPath: string;

  activateWelcomeVideo: boolean;

  status: string;

  profileImageId: ObjectId;

  nickName: string;

  bustSize: string;

  hairColor: string;

  hairLength: string;

  bustType: string;

  orientation: string;

  travels: string[];

  services: string | string[];

  provides: string | string[];

  meetingWith: string | string[];

  aboutMe: string;

  nationality: string;

  smoker: string;

  tattoo: string;

  introVideoLink: string;

  vip: boolean;

  verified: boolean;

  isOnline: boolean;

  offlineAt: Date;

  onlineAt: Date;

  verifiedEmail: boolean;

  phonePrivacy: string;

  currency: string;

  idVerificationId: ObjectId;

  documentVerificationId: ObjectId;

  membershipType: string;
}
