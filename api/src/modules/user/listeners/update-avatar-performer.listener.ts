import { Injectable, Inject } from '@nestjs/common';
import { QueueEvent, QueueEventService } from 'src/kernel';
import { Model } from 'mongoose';
import { PERFORMER_CHANNEL } from 'src/modules/performer/constants';
import { UserModel } from '../models';
import { USER_MODEL_PROVIDER } from '../providers';
import { UserService } from '../services';
import { UserDto } from '../dtos';

const UPDATE_AVATAR_PERFORMER_ACCOUNT = 'UPDATE_AVATAR_PERFORMER_ACCOUNT';

@Injectable()
export class UpdateAvatarPerformerListener {
  constructor(
    private readonly queueEventService: QueueEventService,
    @Inject(USER_MODEL_PROVIDER)
    private readonly User: Model<UserModel>,
    private readonly userService: UserService
  ) {
    this.queueEventService.subscribe(
      PERFORMER_CHANNEL,
      UPDATE_AVATAR_PERFORMER_ACCOUNT,
      this.handle.bind(this)
    );
  }

  private async handle(event: QueueEvent): Promise<void> {
    if (!['avatarUpdated'].includes(event.eventName)) return;
    const { performer, file } = event.data;

    const user = await this.User.findOne({ _id: performer.userId });
    if (!user) return;

    await this.userService.updateAvatar(new UserDto(user), file);
  }
}
