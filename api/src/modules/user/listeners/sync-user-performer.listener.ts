import { Injectable, Inject } from '@nestjs/common';
import { QueueEvent, QueueEventService } from 'src/kernel';
import { Model } from 'mongoose';
import { PERFORMER_CHANNEL } from 'src/modules/performer/constants';
import { EVENT } from 'src/kernel/constants';
import { AuthService } from 'src/modules/auth';
import { AuthCreateDto } from 'src/modules/auth/dtos';
import { UserModel } from '../models';
import { USER_MODEL_PROVIDER } from '../providers';
import { USER_CHANNEL } from '../constants';

const SYNC_USER_PERFORMER_ACCOUNT = 'SYNC_USER_PERFORMER_ACCOUNT';

@Injectable()
export class SyncUserPerformerListener {
  constructor(
    private readonly queueEventService: QueueEventService,
    @Inject(USER_MODEL_PROVIDER)
    private readonly User: Model<UserModel>,
    private readonly authService: AuthService
  ) {
    this.queueEventService.subscribe(
      PERFORMER_CHANNEL,
      SYNC_USER_PERFORMER_ACCOUNT,
      this.handle.bind(this)
    );
  }

  private async handle(event: QueueEvent): Promise<void> {
    try {
      if (![EVENT.CREATED, EVENT.UPDATED].includes(event.eventName)) return;
      const { performer, payload } = event.data;

      let user;
      let addPerformerId = false;
      if (performer.userId) {
        user = await this.User.findOne({ _id: performer.userId });
      }
      if (!user) {
        user = await this.User.findOne({
          username: performer.username
        });
      }
      if (!user) {
        user = new this.User();
        addPerformerId = true;
      }
      user.username = performer.username;
      user.email = performer.email;
      user.firstName = performer.firstName;
      user.lastName = performer.lastName;
      user.roles = ['user', 'performer'];
      user.name = performer.name;
      user.verifiedEmail = performer.verifiedEmail;
      // TODO - check for verifiedEmail option
      await user.save();
      if (addPerformerId) {
        await this.queueEventService.publish({
          channel: USER_CHANNEL,
          eventName: 'performerUserCreated',
          data: {
            userId: user._id,
            performerId: performer._id
          }
        });
      }

      if (payload?.password) {
        await this.authService.removeBySourceId(user._id);
        const authDto = new AuthCreateDto({
          source: 'user',
          sourceId: user._id,
          key: user.username,
          type: 'username',
          value: payload.password
        });
        await this.authService.create(authDto);
        authDto.type = 'email';
        authDto.key = user.email;
        await this.authService.create(authDto);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  }
}
