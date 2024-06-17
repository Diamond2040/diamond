import { Injectable, Inject } from '@nestjs/common';
import { QueueEvent, QueueEventService } from 'src/kernel';
import { Model } from 'mongoose';
import { EVENT } from 'src/kernel/constants';
import {
  PERFORMER_PRODUCT_CHANNEL,
  COUNT_VIDEO_CHANNEL,
  PERFORMER_GALLERY_CHANNEL
} from 'src/modules/assets/services';
import { REACT_MODEL_PROVIDER } from '../providers/reaction.provider';
import { ReactionModel } from '../models/reaction.model';

const DELETE_ASSETS_REACTION_TOPIC = 'DELETE_ASSETS_REACTION_TOPIC';

@Injectable()
export class DeleteAssetsListener {
  constructor(
    private readonly queueEventService: QueueEventService,
    @Inject(REACT_MODEL_PROVIDER)
    private readonly reactionModel: Model<ReactionModel>
  ) {
    this.queueEventService.subscribe(
      COUNT_VIDEO_CHANNEL,
      DELETE_ASSETS_REACTION_TOPIC,
      this.handleDeleteData.bind(this)
    );
    this.queueEventService.subscribe(
      PERFORMER_GALLERY_CHANNEL,
      DELETE_ASSETS_REACTION_TOPIC,
      this.handleDeleteData.bind(this)
    );
    this.queueEventService.subscribe(
      PERFORMER_PRODUCT_CHANNEL,
      DELETE_ASSETS_REACTION_TOPIC,
      this.handleDeleteData.bind(this)
    );
  }

  private async handleDeleteData(event: QueueEvent): Promise<void> {
    if (event.eventName !== EVENT.DELETED) return;
    const { _id } = event.data as any;
    try {
      await this.reactionModel.deleteMany({
        objectId: _id
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  }
}
