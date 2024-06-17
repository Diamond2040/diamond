interface document {
  _id?: string;
  url?: string;
  mimeType?: string;
}

export interface IPerformer {
  _id: string;
  performerId: string;
  name: string;
  username: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: Date;
  email: string;
  phone: string;
  phoneCode: string;
  services: string;
  location: string;
  hairColor: string;
  hairLenght: string;
  bustSize: string;
  bustType: string;
  travel: string;
  provides: string;
  meetingWith: string;
  currency: string;
  avatarPath: string;
  avatar: any;
  coverPath: string;
  cover: any;
  country: string;
  city: string;
  state: string;
  zipcode: string;
  address: string;
  languages: string[];
  categoryIds: string[];
  height: string;
  weight: string;
  bio: string;
  eyes: string;
  sexualOrientation: string;
  stats: {
    likes?: number;
    views?: number;
    totalVideos?: number;
    totalPhotos?: number;
    totalGalleries?: number;
    totalProducts?: number;
    avgRating?: number;
  };
  score: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isOnline: boolean;
  verifiedAccount: boolean;
  verifiedEmail: boolean;
  verifiedDocument: boolean;
  twitterConnected: boolean;
  googleConnected: boolean;
  welcomeVideoId: string;
  welcomeVideoPath: string;
  activateWelcomeVideo: boolean;
  isBookMarked: boolean;
  isSubscribed: boolean;
  ethnicity: string;
  smoker: string;
  nationality: string
  bust: string;
  hair: string;
  pubicHair: string;
  idVerification: any;
  documentVerification: any;
  bodyType: string;
  publicChatPrice: number;
  groupChatPrice: number;
  privateChatPrice: number;
  balance: number;
  socialsLink: {
    facebook: string;
    google: string;
    instagram: string;
    twitter: string;
    linkedIn: string;
  }
  commissionSetting: any;
  ccbillSetting: any;
  paypalSetting: any;
  introVideoLink: string;
  vip: boolean;
  verified: boolean;
}

export interface IBanking {
  firstName?: string;
  lastName?: string;
  SSN?: string;
  bankName?: string;
  bankAccount?: string;
  bankRouting?: string;
  bankSwiftCode?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface IPerformerCreate {
  name?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  dateOfBirth: Date;
  email?: string;
  phone?: string;
  phoneCode?: string;
  bio: string;
  services: string;
  location: string;
  eyes: string;
  hairColor: string;
  hairLenght: string;
  bustSize: string;
  bustType: string;
  travel: string;
  weight: string;
  height: string;
  ethnicity: string;
  sexualOrientation: string;
  smoker: string;
  nationality: string
  provides: string;
  meetingWith: string;
  country?: string;
  status?: string;
  city?: string;
  state?: string;
  address?: string;
  zipcode?: string;
  bankingInformation?: IBankingSetting;
  monthyPrice?: number;
  yearlyPrice?: number;
  verifiedEmail?: boolean;
  introVideoLink: string;
}

export interface IPerformerUpdate {
  name?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  dateOfBirth: Date;
  email?: string;
  phone?: string;
  phoneCode?: string;
  bio: string;
  services: string;
  location: string;
  eyes: string;
  hairColor: string;
  hairLenght: string;
  bustSize: string;
  bustType: string;
  travel: string;
  weight: string;
  height: string;
  ethnicity: string;
  sexualOrientation: string;
  smoker: string;
  nationality: string
  languages?: string[];
  provides: string;
  meetingWith: string;
  country?: string;
  status?: string;
  _id?: string;
  city?: string;
  state?: string;
  address?: string;
  zipcode?: string;
  avatar?: string;
  cover?: string;
  idVerification?: document;
  documentVerification?: document;
  bankingInformation?: IBankingSetting;
  monthyPrice?: number;
  yearlyPrice?: number;
  ccbillSetting?: ICCbillSetting;
  commissionSetting?: ICommissionSetting;
  verifiedEmail?: boolean;
  introVideoLink: string;
}

export interface CCBillPaymentGateway {
  subAccountNumber?: string;
  flexformId?: string;
  salt?: string;
}

export interface ICCbillSetting {
  performerId?: string;
  key?: string;
  status?: string;
  value?: CCBillPaymentGateway;
}

export interface ICommissionSetting {
  performerId?: string;
  monthlySubscriptionCommission?: number;
  yearlySubscriptionCommission?: number;
  videoSaleCommission?: number;
  productSaleCommission?: number;
}

export interface IBankingSetting {
  firstName?: string;
  lastName?: string;
  SSN?: string;
  bankName?: string;
  bankAccount?: string;
  bankRouting?: string;
  bankSwiftCode?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  performerId?: string;
}
