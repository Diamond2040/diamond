export interface IBanking {
  firstName: string;
  lastName: string;
  SSN: string;
  bankName: string;
  bankAccount: string;
  bankRouting: string;
  bankSwiftCode: string;
  address: string;
  city: string;
  state: string;
  country: string;
  performerId: string;
}

export interface IPerformerStats {
  totalGrossPrice: number;
  totalCommission: number;
  totalNetPrice: number;
}

export interface IBlockCountries {
  performerId: string;
  countries: string[];
}

export interface IBlockedByPerformer {
  userId: string;
  description: string;
}

export interface IPerformer {
  _id: string;

  name: string;

  firstName: string;

  lastName: string;

  username: string;

  email: string;

  phone: string;

  phoneCode: string; // international code prefix

  phonePrivacy: string;

  status: string;

  avatarId: string;

  avatarPath: string;

  coverId: string;

  coverPath: string;

  avatar: any;

  cover: any;

  gender: string;

  country: string;

  city: string;

  state: string;

  zipcode: string;

  address: string;

  languages: string[];

  categoryIds: string[];

  timezone: string;

  noteForUser: string;

  height: string;

  weight: string;

  bio: string;

  aboutMe: string;

  eyes: string;

  hair: string;

  pubicHair: string;

  butt: string;

  dateOfBirth: Date;

  sexualOrientation: string;

  stats: {
    numRates: number;
    avgRates: number;
    totalRates: number;
    likes: number;
    views: number;
    totalVideos: number;
    totalGalleries: number;
    totalProducts: number;
  };

  score: number;

  createdBy: string;

  createdAt: Date;

  updatedAt: Date;

  welcomeVideoId: string;

  welcomeVideoPath: string;

  activateWelcomeVideo: boolean;

  bodyType: string;

  categories: any[];

  introVideoLink: string;

  vip: boolean;

  verified: boolean;

  currency: string;

  currencies: string;

  userId: string;

  favourited: boolean;
}
