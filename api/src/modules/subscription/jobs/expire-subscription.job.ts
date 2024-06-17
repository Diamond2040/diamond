import * as moment from 'moment';
import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { AgendaService } from 'src/kernel';
import { PerformerService } from 'src/modules/performer/services';
import { SubscriptionModel } from '../models/subscription.model';
import { SUBSCRIPTION_MODEL_PROVIDER } from '../providers/subscription.provider';
import { SUBSCRIPTION_STATUS } from '../constants';

const EXPIRE_SUBSCRIPTION_AGENDA = 'EXPIRE_SUBSCRIPTION_AGENDA';

@Injectable()
export class ExpireSubscriptionJob {
  constructor(
    @Inject(SUBSCRIPTION_MODEL_PROVIDER)
    private readonly subscriptionModel: Model<SubscriptionModel>,
    private readonly agendaService: AgendaService,
    private readonly performerService: PerformerService
  ) {
    this.defindJobs();
  }

  private async defindJobs() {
    const collection = (this.agendaService as any)._collection;
    await collection.deleteMany({
      name: {
        $in: [EXPIRE_SUBSCRIPTION_AGENDA]
      }
    });

    this.agendaService.define(
      EXPIRE_SUBSCRIPTION_AGENDA,
      {},
      this.scheduleSubscriptionExpiry.bind(this)
    );
    this.agendaService.schedule(
      '1 minute from now',
      EXPIRE_SUBSCRIPTION_AGENDA,
      {}
    );
  }

  private async scheduleSubscriptionExpiry(job: any, done: any): Promise<void> {
    try {
      const expiredSubscriptions = await this.subscriptionModel.find({
        expiredAt: {
          $lte: moment()
            .startOf('day')
            .toDate()
        }
      });
      await expiredSubscriptions.reduce(async (lp, subscription) => {
        await lp;
        await this.subscriptionModel.updateOne(
          {
            _id: subscription._id
          },
          {
            $set: {
              status: SUBSCRIPTION_STATUS.DEACTIVATED,
              membershipType: null
            }
          }
        );
        await this.performerService.updateMembershipType(
          subscription.userId,
          null
        );
        await this.performerService.updateVip(subscription.userId, false);
      }, Promise.resolve());
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('Schedule error', e);
    } finally {
      job.remove();
      this.agendaService.schedule(
        '4 hours from now',
        EXPIRE_SUBSCRIPTION_AGENDA,
        {}
      );
      typeof done === 'function' && done();
    }
  }
}
