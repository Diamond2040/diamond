import { Injectable, Inject } from '@nestjs/common';
import { QueueEvent, QueueEventService } from 'src/kernel';
import { Model } from 'mongoose';
import { REVIEW_CHANNEL } from 'src/modules/review/constants';
import { EVENT } from 'src/kernel/constants';
import { PerformerModel } from '../models';
import { PERFORMER_MODEL_PROVIDER } from '../providers';

const HANDLE_PERFORMER_REVIEW = 'HANDLE_PERFORMER_REVIEW';

@Injectable()
export class HandleReviewListener {
  constructor(
    private readonly queueEventService: QueueEventService,
    @Inject(PERFORMER_MODEL_PROVIDER)
    private readonly Performer: Model<PerformerModel>
  ) {
    this.queueEventService.subscribe(
      REVIEW_CHANNEL,
      HANDLE_PERFORMER_REVIEW,
      this.handler.bind(this)
    );
  }

  private async handler(event: QueueEvent): Promise<void> {
    if (event.eventName !== EVENT.CREATED) return;
    const { source, sourceId, rating } = event.data;
    if (source !== 'performer') {
      return;
    }

    const performer = await this.Performer.findById(sourceId);
    if (!performer) return;
    const stats = performer.stats || {
      totalRates: 0,
      avgRates: 0,
      numRates: 0
    };
    const totalRates = (stats.totalRates || 0) + 1;
    const numRates = (stats.numRates || 0) + rating;
    const avgRates = Math.round((numRates / totalRates) / 100) * 100;
    await this.Performer.updateOne({ _id: performer._id }, {
      $set: {
        'stats.totalRates': totalRates,
        'stats.avgRates': avgRates,
        'stats.numRates': numRates
      }
    });
  }
}
