import { Injectable, Inject } from '@nestjs/common';
import { QueueEvent, QueueEventService } from 'src/kernel';
import { Model } from 'mongoose';
import { USER_CHANNEL } from 'src/modules/user/constants';
import { PerformerModel } from '../models';
import { PERFORMER_MODEL_PROVIDER } from '../providers';

const SYNC_USER_ID_PERFORMER_ACCOUNT = 'SYNC_USER_ID_PERFORMER_ACCOUNT';

@Injectable()
export class SyncUserIdPerformerListener {
  constructor(
    private readonly queueEventService: QueueEventService,
    @Inject(PERFORMER_MODEL_PROVIDER)
    private readonly Performer: Model<PerformerModel>
  ) {
    this.queueEventService.subscribe(
      USER_CHANNEL,
      SYNC_USER_ID_PERFORMER_ACCOUNT,
      this.handle.bind(this)
    );
  }

  private async handle(event: QueueEvent): Promise<void> {
    if (!['performerUserCreated'].includes(event.eventName)) return;
    const { performerId, userId } = event.data;

    await this.Performer.updateOne({
      _id: performerId
    }, {
      $set: {
        userId
      }
    });
  }
}
