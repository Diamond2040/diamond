import { Connection } from 'mongoose';
import { MONGO_DB_PROVIDER } from 'src/kernel';
import { BookingSchema } from '../schemas/booking.schema';
import { UserBookingNotification } from '../schemas/user-booking-notification.schema';

export const BOOKING_SCHEDULE_PROVIDER = 'BOOKING_SCHEDULE_PROVIDER';
export const USER_BOOKING_NOTIFICATION_PROVIDER = 'USER_BOOKING_NOTIFICATION_PROVIDER';

export const scheduleProviders = [
  {
    provide: BOOKING_SCHEDULE_PROVIDER,
    useFactory: (connection: Connection) => connection.model('Booking', BookingSchema),
    inject: [MONGO_DB_PROVIDER]
  },
  {
    provide: USER_BOOKING_NOTIFICATION_PROVIDER,
    useFactory: (connection: Connection) => connection.model('UserBookingNotification', UserBookingNotification),
    inject: [MONGO_DB_PROVIDER]
  }
];
