import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { PERFORMER_STATUSES } from 'src/modules/performer/constants';
import { USER_MODEL_PROVIDER } from '../../user/providers';
import { UserModel } from '../../user/models';
import { PERFORMER_MODEL_PROVIDER } from '../../performer/providers';
import { PerformerModel } from '../../performer/models';
import { ORDER_MODEL_PROVIDER } from '../../payment/providers';
import { OrderModel } from '../../payment/models';
import { STATUS_ACTIVE, STATUS_INACTIVE } from '../../user/constants';
import { ORDER_STATUS } from '../../payment/constants';

@Injectable()
export class StatisticService {
  constructor(
    @Inject(USER_MODEL_PROVIDER)
    private readonly userModel: Model<UserModel>,
    @Inject(PERFORMER_MODEL_PROVIDER)
    private readonly performerModel: Model<PerformerModel>,
    @Inject(ORDER_MODEL_PROVIDER)
    private readonly orderModel: Model<OrderModel>
  ) { }

  public async stats(): Promise<any> {
    const totalActiveUsers = await this.userModel.countDocuments({ status: STATUS_ACTIVE });
    const totalInactiveUsers = await this.userModel.countDocuments({ status: STATUS_INACTIVE });
    const totalPerformers = await this.performerModel.countDocuments({ });
    const totalPendingPerformers = await this.performerModel.countDocuments({
      status: PERFORMER_STATUSES.WAIRING_FOR_REVIEW
    });
    const [totalMoneyEarnings] = await Promise.all([
      this.orderModel.aggregate([
        {
          $match: {
            status: ORDER_STATUS.PAID
          }
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: '$totalPrice'
            }
          }
        }
      ])
    ]);

    return {
      totalActiveUsers,
      totalInactiveUsers,
      totalPerformers,
      totalPendingPerformers,
      totalMoneyEarnings: (totalMoneyEarnings && totalMoneyEarnings[0] && totalMoneyEarnings[0].total) || 0
    };
  }
}
