import { ObjectId } from 'mongodb';
import { pick } from 'lodash';
import { FileDto } from 'src/modules/file';

export interface IPerformerResponse {
  _id: ObjectId;

  name?: string;

  firstName?: string;

  lastName?: string;

  username?: string;

  email?: string;

  phone?: string;

  phoneCode?: string; // international code prefix

  status?: string;

  avatarId?: ObjectId;

  avatarPath?: string;

  avatar?: any;

  cover?: any;

  gender?: string;

  country?: string;

  city?: string;

  state?: string;

  zipcode?: string;

  address?: string;

  languages?: string[];

  categoryIds?: ObjectId[];

  categories?: any[];

  height?: string;

  weight?: string;

  bio?: string;

  eyes?: string;

  hair?: string;

  pubicHair?: string;

  bodyType?: string;

  ethnicity?: string;

  dateOfBirth?: Date;

  stats?: {
    likes?: number;
    views?: number;
  };

  score?: number;

  createdBy?: ObjectId;

  createdAt?: Date;

  updatedAt?: Date;

  welcomeVideoId?: ObjectId;

  welcomeVideoPath?: string;

  activateWelcomeVideo?: boolean;

  profileImageId?: ObjectId;

  profileImage?: string;

  nickName?: string;

  bustSize?: string;

  hairColor?: string;

  hairLength?: string;

  bustType?: string;

  orientation?: string;

  travels?: string[];

  services?: string | string[];

  provides?: string | string[];

  meetingWith?: string | string[];

  aboutMe?: string;

  nationality?: string;

  smoker?: string;

  userId?: string;
}

export class PerformerDto {
  _id: ObjectId;

  name?: string;

  firstName?: string;

  lastName?: string;

  username?: string;

  email?: string;

  phone?: string;

  phoneCode?: string; // international code prefix

  status?: string;

  avatarId?: ObjectId;

  avatarPath?: string;

  coverId?: ObjectId;

  coverPath?: string;

  avatar?: any;

  cover?: any;

  gender?: string;

  country?: string;

  city?: string;

  state?: string;

  zipcode?: string;

  address?: string;

  languages?: string[];

  categoryIds?: ObjectId[];

  categories?: any[];

  height?: string;

  weight?: string;

  bio?: string;

  eyes?: string;

  hair?: string;

  pubicHair?: string;

  bodyType?: string;

  ethnicity?: string;

  dateOfBirth?: Date;

  stats?: {
    likes?: number;
    views?: number;
    totalRates?: number;
    avgRates?: number;
  };

  score?: number;

  createdBy?: ObjectId;

  createdAt?: Date;

  updatedAt?: Date;

  welcomeVideoId?: ObjectId;

  welcomeVideoPath?: string;

  activateWelcomeVideo?: boolean;

  profileImageId?: ObjectId;

  profileImage?: string;

  nickName?: string;

  bustSize?: string;

  hairColor?: string;

  hairLength?: string;

  bustType?: string;

  orientation?: string;

  travels?: string[];

  services?: string | string[];

  provides?: string | string[];

  meetingWith?: string | string[];

  aboutMe?: string;

  nationality?: string;

  smoker?: string;

  tattoo?: string;

  introVideoLink?: string;

  vip?: boolean;

  verified?: boolean;

  isOnline: boolean;

  offlineAt: Date;

  verifiedEmail: boolean;

  phonePrivacy: string;

  currency: string;

  userId: string;

  idVerification: any;

  documentVerification: any;

  constructor(data?: Partial<any>) {
    Object.assign(
      this,
      pick(data, [
        '_id',
        'name',
        'firstName',
        'lastName',
        'dateOfBirth',
        'name',
        'username',
        'email',
        'phone',
        'phoneCode',
        'status',
        'avatarId',
        'avatarPath',
        'coverId',
        'coverPath',
        'gender',
        'country',
        'city',
        'state',
        'zipcode',
        'address',
        'languages',
        'categoryIds',
        'categories',
        'height',
        'weight',
        'bio',
        'hair',
        'pubicHair',
        'bodyType',
        'ethnicity',
        'eyes',
        'stats',
        'score',
        'createdBy',
        'createdAt',
        'updatedAt',
        'welcomeVideoId',
        'welcomeVideoPath',
        'activateWelcomeVideo',
        'profileImageId',
        'profileImage',
        'nickName',
        'bustSize',
        'hairColor',
        'hairLength',
        'bustType',
        'orientation',
        'travel',
        'services',
        'provides',
        'meetingWith',
        'aboutMe',
        'nationality',
        'smoker',
        'tattoo',
        'travels',
        'vip',
        'verified',
        'isOnline',
        'offlineAt',
        'verifiedEmail',
        'introVideoLink',
        'phonePrivacy',
        'currency',
        'userId'
      ])
    );
  }

  toResponse(includePrivateInfo = false, isAdmin?: boolean) {
    const publicInfo = {
      _id: this._id,
      name: this.name || this.getName(),
      avatar: FileDto.getPublicUrl(this.avatarPath),
      cover: FileDto.getPublicUrl(this.coverPath),
      username: this.username,
      gender: this.gender,
      dateOfBirth: this.dateOfBirth,
      country: this.country,
      stats: this.stats,
      bodyType: this.bodyType,
      categoryIds: this.categoryIds,
      categories: this.categories,
      height: this.height,
      weight: this.weight,
      bio: this.bio,
      eyes: this.eyes,
      hair: this.hair,
      pubicHair: this.pubicHair,
      ethnicity: this.ethnicity,
      languages: this.languages,
      welcomeVideoId: this.welcomeVideoId,
      welcomeVideoPath: FileDto.getPublicUrl(this.welcomeVideoPath),
      activateWelcomeVideo: this.activateWelcomeVideo,
      profileImageId: this.profileImageId,
      profileImage: this.profileImage,
      nickName: this.nickName,
      bustSize: this.bustSize,
      orientation: this.orientation,
      travels: this.travels,
      services: this.services,
      provides: this.provides,
      meetingWith: this.meetingWith,
      aboutMe: this.aboutMe,
      hairColor: this.hairColor,
      hairLength: this.hairLength,
      bustType: this.bustType,
      nationality: this.nationality,
      smoker: this.smoker,
      tattoo: this.tattoo,
      introVideoLink: this.introVideoLink,
      vip: this.vip,
      verified: this.verified,
      isOnline: this.isOnline,
      offlineAt: this.offlineAt,
      userId: this.userId
    };
    const privateInfo = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
      phoneCode: this.phoneCode,
      status: this.status,
      city: this.city,
      state: this.state,
      zipcode: this.zipcode,
      address: this.address,
      verifiedEmail: this.verifiedEmail,
      phonePrivacy: this.phonePrivacy,
      currency: this.currency,
      idVerification: this.idVerification,
      documentVerification: this.documentVerification,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };

    if (isAdmin) {
      return {
        ...publicInfo,
        ...privateInfo
      };
    }

    if (!includePrivateInfo) {
      return publicInfo;
    }

    return {
      ...publicInfo,
      ...privateInfo
    };
  }

  getName() {
    if (this.name) return this.name;
    return this.username; // [this.firstName || '', this.lastName || ''].join(' ');
  }

  toSearchResponse() {
    return {
      _id: this._id,
      name: this.name || this.getName(),
      avatar: FileDto.getPublicUrl(this.avatarPath),
      username: this.username,
      gender: this.gender,
      languages: this.languages,
      stats: this.stats,
      score: this.score,
      aboutMe: this.aboutMe,
      country: this.country,
      vip: this.vip,
      verified: this.verified,
      userId: this.userId
    };
  }

  toPublicDetailsResponse() {
    return {
      _id: this._id,
      name: this.name || this.getName(),
      avatar: FileDto.getPublicUrl(this.avatarPath),
      cover: FileDto.getPublicUrl(this.coverPath),
      username: this.username,
      gender: this.gender,
      dateOfBirth: this.dateOfBirth,
      country: this.country,
      city: this.city,
      state: this.state,
      zipcode: this.zipcode,
      address: this.address,
      stats: this.stats,
      bodyType: this.bodyType,
      categoryIds: this.categoryIds,
      categories: this.categories,
      height: this.height,
      weight: this.weight,
      bio: this.bio,
      eyes: this.eyes,
      hair: this.hair,
      pubicHair: this.pubicHair,
      ethnicity: this.ethnicity,
      languages: this.languages,
      score: this.score,
      welcomeVideoId: this.welcomeVideoId,
      welcomeVideoPath: FileDto.getPublicUrl(this.welcomeVideoPath),
      activateWelcomeVideo: this.activateWelcomeVideo,
      profileImageId: this.profileImageId,
      profileImage: this.profileImage,
      nickName: this.nickName,
      bustSize: this.bustSize,
      orientation: this.orientation,
      travels: this.travels,
      services: this.services,
      provides: this.provides,
      meetingWith: this.meetingWith,
      aboutMe: this.aboutMe,
      hairColor: this.hairColor,
      hairLength: this.hairLength,
      bustType: this.bustType,
      nationality: this.nationality,
      smoker: this.smoker,
      tattoo: this.tattoo,
      vip: this.vip,
      verified: this.verified,
      introVideoLink: this.introVideoLink,
      phone: this.phonePrivacy === 'public' ? this.phone : null,
      phoneCode: this.phonePrivacy === 'public' ? this.phoneCode : null,
      currency: this.currency,
      isOnline: this.isOnline,
      offlineAt: this.offlineAt,
      userId: this.userId
    };
  }
}
