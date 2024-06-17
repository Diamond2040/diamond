import { Connection } from 'mongoose';
import { MONGO_DB_PROVIDER } from 'src/kernel';
import { CustomAttributeSchema } from '../schemas';

export const CUSTOM_ATTRIBUTE_DB_PROVIDER = 'CUSTOM_ATTRIBUTE_DB_PROVIDER';

export const customAttributeProviders = [
  {
    provide: CUSTOM_ATTRIBUTE_DB_PROVIDER,
    useFactory: (connection: Connection) => connection.model('CustomAttribute', CustomAttributeSchema),
    inject: [MONGO_DB_PROVIDER]
  }
];
