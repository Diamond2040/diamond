import { Injectable, Inject, HttpException } from '@nestjs/common';
import { Model } from 'mongoose';
import {
  EntityNotFoundException
} from 'src/kernel';
import { isObjectId } from 'src/kernel/helpers/string.helper';
import { CCBillService } from 'src/modules/payment/services';
import { SettingService } from 'src/modules/settings/services';
import { SETTING_KEYS } from 'src/modules/settings/constants';
import { MissingConfigPaymentException } from 'src/modules/payment/exceptions';
import { PerformerService } from 'src/modules/performer/services';
import { SubscriptionModel } from '../models/subscription.model';
import { SUBSCRIPTION_MODEL_PROVIDER } from '../providers/subscription.provider';
import {
  SUBSCRIPTION_STATUS
} from '../constants';

@Injectable()
export class CancelSubscriptionService {
  constructor(
    @Inject(SUBSCRIPTION_MODEL_PROVIDER)
    private readonly subscriptionModel: Model<SubscriptionModel>,
    private readonly settingService: SettingService,
    private readonly ccbillService: CCBillService,
    private readonly performerService: PerformerService
  ) {}

  public async cancelSubscription(id: string, forceExpired = false) {
    const query = {} as any;
    if (isObjectId(id)) query._id = id;
    else query.subscriptionId = id;
    const subscription = await this.subscriptionModel.findOne(query);
    if (!subscription) throw new EntityNotFoundException();

    if (
      !subscription.transactionId
      || subscription.subscriptionType !== 'recurring'
    ) {
      subscription.status = SUBSCRIPTION_STATUS.DEACTIVATED;
      subscription.updatedAt = new Date();
      // cancel imediately?
      if (forceExpired) subscription.expiredAt = new Date();
      subscription.membershipType = null;
      subscription.packageName = null;
      subscription.currentPackageId = null;
      await this.performerService.updateMembershipType(
        subscription.userId,
        null
      );
      await this.performerService.updateVip(subscription.userId, false);
      await subscription.save();
      return { success: true };
    }

    if (subscription.paymentGateway !== 'ccbill') {
      throw new HttpException(
        'Only support to cancel subscription CCbill',
        422
      );
    }

    const [
      ccbillClientAccNo,
      ccbillDatalinkUsername,
      ccbillDatalinkPassword
    ] = await Promise.all([
      this.settingService.getKeyValue(
        SETTING_KEYS.CCBILL_CLIENT_ACCOUNT_NUMBER
      ),
      this.settingService.getKeyValue(SETTING_KEYS.CCBILL_DATALINK_USERNAME),
      this.settingService.getKeyValue(SETTING_KEYS.CCBILL_DATALINK_PASSWORD)
    ]);
    if (
      !ccbillClientAccNo
      || !ccbillDatalinkUsername
      || !ccbillDatalinkPassword
    ) {
      throw new MissingConfigPaymentException();
    }

    const status = await this.ccbillService.cancelSubscription({
      subscriptionId: subscription.subscriptionId,
      ccbillClientAccNo,
      ccbillDatalinkUsername,
      ccbillDatalinkPassword
    });
    if (!status) {
      throw new HttpException(
        `Cannot cancel subscription ${subscription.subscriptionId}`,
        403
      );
    }
    subscription.status = SUBSCRIPTION_STATUS.DEACTIVATED;
    subscription.updatedAt = new Date();
    subscription.membershipType = null;
    subscription.packageName = null;
    subscription.currentPackageId = null;
    // cancel imediately?
    // subscription.expiredAt = new Date();
    await subscription.save();
    await this.performerService.updateMembershipType(subscription.userId, null);
    await this.performerService.updateVip(subscription.userId, false);
    return { success: true };
  }
}
