import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { QueueEvent, QueueEventService } from 'src/kernel';
import { EVENT } from 'src/kernel/constants';
import { SocketUserService } from 'src/modules/socket/services/socket-user.service';
import { BOOKING_CHANNEL } from '../constants';
import { BookingDto } from '../dtos';
import { UserBookingNotificationService } from '../services';

const BOOKING_CREATED_SUCCESS = 'BOOKING_CREATED_SUCCESS';

@Injectable()
export class BookingListener implements OnModuleInit {
  private logger = new Logger(BookingListener.name);

  constructor(
    private readonly queueEventService: QueueEventService,
    private readonly socketUserService: SocketUserService,
    private readonly notificationService: UserBookingNotificationService
  ) {}

  onModuleInit() {
    this.queueEventService.subscribe(
      BOOKING_CHANNEL,
      BOOKING_CREATED_SUCCESS,
      this.subscribe.bind(this)
    );
  }

  async subscribe(event: QueueEvent) {
    try {
      const { eventName, data } = event;

      const { targetId, fromSourceId, _id } = data as BookingDto;
      if (eventName === EVENT.CREATED) {
        await this.socketUserService.emitToUsers(
          targetId,
          'nofify_created_booking',
          data
        );
      } else if (eventName === EVENT.UPDATED) {
        await this.notificationService.create(fromSourceId, _id, targetId);
        await this.socketUserService.emitToUsers(
          fromSourceId,
          'notify_booking_status_changed',
          {}
        );
      }
    } catch (e) {
      this.logger.error(e);
    }
  }
}
