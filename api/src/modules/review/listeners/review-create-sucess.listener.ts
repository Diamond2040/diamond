import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { QueueEvent, QueueEventService } from 'src/kernel';
import { EVENT } from 'src/kernel/constants';
import { PerformerService } from 'src/modules/performer/services';
import { ReviewSource, REVIEW_CHANNEL } from '../constants';

const REVIEW_CREATED_SUCCESS = 'REVIEW_CREATED_SUCCESS';

@Injectable()
export class ReviewCreateSucessListenner implements OnModuleInit {
  private logger = new Logger(ReviewCreateSucessListenner.name);

  constructor(
    private readonly _PerformerService: PerformerService,
    private readonly _QueueEventService: QueueEventService
  ) {}

  onModuleInit() {
    // this._QueueEventService.subscribe(
    //   REVIEW_CHANNEL,
    //   REVIEW_CREATED_SUCCESS,
    //   this.subscriber.bind(this)
    // );
  }

  async subscriber(event: QueueEvent) {
    try {
      const { data, eventName } = event;
      if (eventName !== EVENT.CREATED) {
        return;
      }

      const { source, sourceId, rating } = data;
      if (source === ReviewSource.Performer) {
        // this._PerformerService.updateRatingStat(sourceId, rating);
      }
    } catch (error) {
      this.logger.error(error);
    }
  }
}
