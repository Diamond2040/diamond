import * as mongoose from 'mongoose';

const performerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId
  },
  name: String,
  firstName: String,
  lastName: String,
  username: {
    type: String,
    index: true,
    lowercase: true,
    unique: true,
    trim: true,
    // uniq if not null
    sparse: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true
  },
  status: {
    type: String,
    index: true
  },
  phone: {
    type: String
  },
  phoneCode: String, // international code prefix, store as country_phonecode
  phonePrivacy: {
    type: String,
    default: 'public'
  },
  avatarId: {
    type: mongoose.Schema.Types.ObjectId
  },
  avatarPath: String,
  coverId: {
    type: mongoose.Schema.Types.ObjectId
  },
  coverPath: String,
  welcomeVideoId: {
    type: mongoose.Schema.Types.ObjectId
  },
  welcomeVideoPath: {
    type: String
  },
  activateWelcomeVideo: {
    type: Boolean,
    default: false
  },
  gender: {
    type: String
  },
  country: {
    type: String
  },
  city: String,
  state: String,
  zipcode: String,
  address: String,
  languages: [
    {
      type: String
    }
  ],
  categoryIds: [
    {
      _id: false,
      type: mongoose.Schema.Types.ObjectId
    }
  ],
  height: String,
  weight: String,
  eyes: String,
  dateOfBirth: Date,
  ethnicity: String,
  stats: {
    likes: {
      type: Number,
      default: 0
    },
    views: {
      type: Number,
      default: 0
    },
    totalRates: {
      type: Number,
      default: 0
    },
    avgRates: {
      type: Number,
      default: 0
    },
    numRates: {
      type: Number,
      default: 0
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId
  },
  score: {
    type: Number,
    default: 0
  },
  nickName: String,
  bustSize: String,
  hairColor: String,
  hairLength: String,
  bustType: String,
  orientation: String,
  travels: [
    {
      _id: false,
      type: String,
      index: true
    }
  ],
  services: [
    {
      _id: false,
      type: String,
      index: true
    }
  ],
  provides: [
    {
      _id: false,
      type: String,
      index: true
    }
  ],
  meetingWith: [
    {
      _id: false,
      type: String,
      index: true
    }
  ],
  aboutMe: String,
  nationality: {
    type: String,
    index: true
  },
  smoker: {
    type: String,
    index: true
  },
  tattoo: {
    type: String,
    index: true
  },
  introVideoLink: String,
  vip: {
    type: Boolean,
    default: false
  },
  verified: {
    type: Boolean,
    default: false
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  onlineAt: {
    type: Date,
    index: true
  },
  offlineAt: {
    type: Date
  },
  verifiedEmail: {
    type: Boolean,
    default: false
  },
  currency: {
    type: String,
    default: 'usd'
  },
  idVerificationId: {
    type: mongoose.Schema.Types.ObjectId
  },
  documentVerificationId: {
    type: mongoose.Schema.Types.ObjectId
  },
  membershipType: {
    type: String,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export const PerformerSchema = performerSchema;
