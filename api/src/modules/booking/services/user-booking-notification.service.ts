import { Inject, Injectable } from '@nestjs/common';
import { pick, uniq } from 'lodash';
import { ObjectId } from 'mongodb';
import { FilterQuery, Model } from 'mongoose';
import { UserDto } from 'src/modules/user/dtos';
import { UserService } from 'src/modules/user/services';
import { BookingService } from '.';
import { UserBookingNotificationModel } from '../models/user-booking-notification.model';
import { USER_BOOKING_NOTIFICATION_PROVIDER } from '../providers';

@Injectable()
export class UserBookingNotificationService {
  constructor(
    @Inject(USER_BOOKING_NOTIFICATION_PROVIDER)
    private readonly UserBookingNotification: Model<
      UserBookingNotificationModel
    >,
    private readonly bookingService: BookingService,
    private readonly userService: UserService
  ) {}

  async create(userId: ObjectId, itemId: ObjectId, performerId: ObjectId) {
    let notification = await this.UserBookingNotification.findOne({
      userId,
      itemId
    });
    if (!notification) {
      notification = await this.UserBookingNotification.create({
        userId,
        itemId,
        performerId
      });
    }

    const data = await this.bookingService.findById(itemId);
    if (!data) {
      this.UserBookingNotification.deleteMany({ itemId });
      return null;
    }

    await notification.save();
    return notification;
  }

  async search(currentUser: UserDto) {
    const query: FilterQuery<UserBookingNotificationModel> = {
      userId: currentUser._id
    };
    const [data, total] = await Promise.all([
      this.UserBookingNotification.find(query)
        .sort('-createdAt')
        .skip(0)
        .limit(10)
        .lean(),
      this.UserBookingNotification.countDocuments(query)
    ]);
    const [items, performers] = await Promise.all([
      this.bookingService.findByIds(uniq(data.map((d) => d.itemId))),
      this.userService.findByIds(uniq(data.map((d) => d.performerId)))
    ]);

    return {
      data: data.map((notification) => {
        const performer = performers.find((result) => result._id.equals(notification.performerId));
        const item = items.find((result) => result._id.equals(notification.itemId));
        return {
          ...notification,
          ...(performer && { dataInfo: new UserDto(performer).toResponse() }),
          ...(item && pick(item, ['status', 'startAt'])),
          fromSourceId: notification.userId,
          targetId: notification.performerId
        };
      }),
      total
    };
  }

  dismissAll(currentUser: UserDto) {
    return this.UserBookingNotification.deleteMany({ userId: currentUser._id });
  }
}
