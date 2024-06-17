import { Connection } from 'mongoose';
import { MONGO_DB_PROVIDER } from 'src/kernel';
import { scheduleSchema } from '../schemas';

export const PERFORMER_SCHEDULE_PROVIDER = 'PERFORMER_SCHEDULE_PROVIDER';

export const scheduleProvider = [
  {
    provide: PERFORMER_SCHEDULE_PROVIDER,
    useFactory: (connection: Connection) => connection.model('PerformerSchedule', scheduleSchema),
    inject: [MONGO_DB_PROVIDER]
  }
];
