import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { QueueEventService, QueueEvent } from 'src/kernel';
import {
  PAYMENT_TYPE,
  ORDER_PAID_SUCCESS_CHANNEL
} from 'src/modules/payment/constants';
import { EVENT, STATUS } from 'src/kernel/constants';
import * as moment from 'moment';
import { OrderDetailsModel, OrderModel, PaymentTransactionModel } from 'src/modules/payment/models';
import { PerformerService } from 'src/modules/performer/services';
import { SubscriptionModel } from '../models/subscription.model';
import { SUBSCRIPTION_MODEL_PROVIDER, SUBSCRIPTION_PACKAGE_MODEL_PROVIDER } from '../providers/subscription.provider';
import { SubscriptionDto } from '../dtos/subscription.dto';
import { SubscriptionPackageModel } from '../models';

const UPDATE_SUBSCRIPTION_CHANNEL = 'UPDATE_SUBSCRIPTION_CHANNEL';

@Injectable()
export class OrderSubscriptionListener {
  constructor(
    @Inject(SUBSCRIPTION_MODEL_PROVIDER)
    private readonly subscriptionModel: Model<SubscriptionModel>,
    @Inject(SUBSCRIPTION_PACKAGE_MODEL_PROVIDER)
    private readonly SubscriptionPackage: Model<SubscriptionPackageModel>,
    private readonly queueEventService: QueueEventService,
    private readonly performerService: PerformerService
  ) {
    this.queueEventService.subscribe(
      ORDER_PAID_SUCCESS_CHANNEL,
      UPDATE_SUBSCRIPTION_CHANNEL,
      this.handleListenSubscription.bind(this)
    );
  }

  public async handleListenSubscription(
    event: QueueEvent
    // transactionPayload: any, eventType?: string
  ): Promise<any> {
    try {
      if (![EVENT.CREATED, EVENT.DELETED].includes(event.eventName)) {
        return;
      }
      const { transaction, order, orderDetails } = event.data;
      if (![PAYMENT_TYPE.SUBSCRIPTION_PACKAGE].includes(order.type)) {
        return;
      }
      // not support for other gateway
      if (transaction.paymentGateway !== 'ccbill') {
        return;
      }
      await this.handleCCBillSubscription(order, orderDetails, transaction);
    } catch (e) {
      // TODO - log me
      // eslint-disable-next-line no-console
      console.log('err_listen_subscription', e);
    }
  }

  private async handleCCBillSubscription(
    order: OrderModel,
    orderDetails: OrderDetailsModel,
    transaction: PaymentTransactionModel
  ) {
    const performer = await this.performerService.findByUserId(order.buyerId);
    if (!performer) return false;

    const existSubscription = await this.subscriptionModel.findOne({
      userId: performer._id
    });
    const subscriptionPackage = await this.SubscriptionPackage.findOne({
      _id: orderDetails[0].productId
    });
    const membershipType = subscriptionPackage?.membershipType || 'basic';
    // load the model details and update info
    let expiredAt;
    if (transaction?.paymentResponseInfo?.nextRenewalDate) {
      expiredAt = moment(
        transaction?.paymentResponseInfo?.nextRenewalDate
      ).toDate();
    } else if (transaction?.paymentResponseInfo?.initialPeriod) {
      expiredAt = moment()
        .add(transaction?.paymentResponseInfo?.initialPeriod, 'days')
        .toDate();
    } else if (orderDetails[0]?.extraInfo?.initalPeriod) {
      // check extra field in model details if have
      expiredAt = moment()
        .add(orderDetails[0]?.extraInfo?.initalPeriod, 'days')
        .toDate();
    } else if (orderDetails[0]?.extraInfo?.recurringPeriod) {
      // check extra field in model details if have
      expiredAt = moment()
        .add(orderDetails[0]?.extraInfo?.recurringPeriod, 'days')
        .toDate();
    } else {
      return false;
    }
    const subscriptionType = orderDetails[0]?.extraInfo?.recurring
      ? 'recurring'
      : 'single';
    const subscriptionId = transaction?.paymentResponseInfo?.subscriptionId
        || transaction?.paymentResponseInfo?.subscription_id
        || null;
    const paymentResponseInfo = transaction?.paymentResponseInfo || ({} as any);
    const { paymentGateway } = transaction;
    const startRecurringDate = paymentResponseInfo.renewalDate || paymentResponseInfo.timestamp;
    const nextRecurringDate = paymentResponseInfo.nextRenewalDate;
    if (existSubscription) {
      existSubscription.expiredAt = new Date(expiredAt);
      existSubscription.updatedAt = new Date();
      existSubscription.subscriptionType = subscriptionType;
      existSubscription.transactionId = transaction._id;
      existSubscription.meta = paymentResponseInfo;
      existSubscription.subscriptionId = subscriptionId;
      existSubscription.paymentGateway = paymentGateway;
      existSubscription.startRecurringDate = startRecurringDate
        ? new Date(startRecurringDate)
        : new Date();
      existSubscription.nextRecurringDate = nextRecurringDate
        ? new Date(nextRecurringDate)
        : new Date(expiredAt);
      existSubscription.status = STATUS.ACTIVE;
      existSubscription.packageName = subscriptionPackage?.name || membershipType;
      existSubscription.currentPackageId = orderDetails[0].productId;
      existSubscription.membershipType = membershipType;
      await existSubscription.save();

      // update model status
      if (membershipType === 'premium') { await this.performerService.updateVip(performer._id); }
      await this.performerService.updateMembershipType(
        performer._id,
        membershipType
      );
      return new SubscriptionDto(existSubscription);
    }
    const newSubscription = await this.subscriptionModel.create({
      performerId: order.sellerId,
      userId: performer._id,
      createdAt: new Date(),
      updatedAt: new Date(),
      expiredAt: new Date(expiredAt),
      subscriptionType,
      subscriptionId,
      meta: paymentResponseInfo,
      paymentGateway,
      startRecurringDate: startRecurringDate
        ? new Date(startRecurringDate)
        : new Date(),
      nextRecurringDate: nextRecurringDate
        ? new Date(nextRecurringDate)
        : new Date(expiredAt),
      transactionId: transaction._id,
      status: STATUS.ACTIVE,
      packageName: subscriptionPackage?.name || membershipType,
      currentPackageId: orderDetails[0].productId,
      membershipType
    });

    // update VIp status
    // update model status
    if (membershipType === 'premium') { await this.performerService.updateVip(performer._id); }

    // update model status
    await this.performerService.updateMembershipType(
      performer._id,
      membershipType
    );

    return new SubscriptionDto(newSubscription);
  }
}
