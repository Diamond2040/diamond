import { Provider } from '@nestjs/common';
import { Connection } from 'mongoose';
import { MONGO_DB_PROVIDER } from 'src/kernel';
import { abuseReportSchema } from '../schemas';

export const ABUSE_REPORT_MODEL = 'ABUSE_REPORT_MODEL';

export const abuseReportProvider: Provider = {
  inject: [MONGO_DB_PROVIDER],
  provide: ABUSE_REPORT_MODEL,
  useFactory: (connection: Connection) => connection.model('AbuseReport', abuseReportSchema)
};
