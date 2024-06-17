import * as mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  subscriptionType: {
    type: String
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    index: true
  },
  subscriptionId: {
    type: String,
    index: true
  },
  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    index: true
  },
  paymentGateway: {
    type: String,
    default: 'ccbill',
    index: true
  },
  startRecurringDate: {
    type: Date,
    default: Date.now
  },
  nextRecurringDate: {
    type: Date
  },
  status: {
    type: String,
    default: 'active',
    index: true
  },
  membershipType: {
    type: String
  },
  packageName: String,
  currentPackageId: mongoose.Schema.Types.ObjectId,
  meta: {
    type: mongoose.Schema.Types.Mixed
  },
  expiredAt: {
    type: Date,
    default: Date.now
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
subscriptionSchema.pre<any>('save', function preSave(next) {
  this.updatedAt = new Date();
  next();
});
subscriptionSchema.pre<any>('updateOne', function preUpdateOne(next) {
  this.updatedAt = new Date();
  next();
});

export const SubscriptionSchema = subscriptionSchema;
