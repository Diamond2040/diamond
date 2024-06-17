import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { PageableData } from 'src/kernel';
import { SUBSCRIPTION_PACKAGE_MODEL_PROVIDER } from '../../subscription/providers';
import { SubscriptionPackageModel } from '../models';
import { SubscriptionPackageSearchPayload } from '../payloads/index';

@Injectable()
export class SubscriptionPackageSearchService {
  constructor(
    @Inject(SUBSCRIPTION_PACKAGE_MODEL_PROVIDER)
    private readonly subscriptionPackageModel: Model<SubscriptionPackageModel>
  ) {}

  public async search(req: SubscriptionPackageSearchPayload): Promise<PageableData<SubscriptionPackageModel>> {
    const query = {} as any;
    if (req.q) {
      query.$or = [
        {
          name: { $regex: new RegExp(req.q.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''), 'i') }
        }
      ];
    }
    if (req.isActive) query.isActive = req.isActive;
    const sort = {
      [req.sortBy || 'ordering']: req.sort || 1,
      updatedAt: -1
    };
    const [data, total] = await Promise.all([
      this.subscriptionPackageModel
        .find(query)
        .sort(sort)
        .limit(parseInt(req.limit as string, 10))
        .skip(parseInt(req.offset as string, 10)),
      this.subscriptionPackageModel.countDocuments(query)
    ]);

    return {
      data,
      total
    };
  }

  public async userSearch(req: SubscriptionPackageSearchPayload): Promise<PageableData<SubscriptionPackageModel>> {
    const query = {
      isActive: true
    } as any;
    if (req.q) {
      query.$or = [
        {
          name: { $regex: new RegExp(req.q.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''), 'i') }
        }
      ];
    }
    const sort = {
      [req.sortBy || 'ordering']: req.sort || 1,
      updatedAt: -1
    };
    const [data, total] = await Promise.all([
      this.subscriptionPackageModel
        .find(query)
        .sort(sort)
        .limit(parseInt(req.limit as string, 10))
        .skip(parseInt(req.offset as string, 10)),
      this.subscriptionPackageModel.countDocuments(query)
    ]);

    return {
      data,
      total
    };
  }
}
