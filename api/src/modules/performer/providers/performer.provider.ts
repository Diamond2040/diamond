import { Connection } from 'mongoose';
import { MONGO_DB_PROVIDER } from 'src/kernel';
import {
  PerformerProfileImageSchema,
  PerformerSchema
} from '../schemas';
import { ServiceSettingSchema } from '../schemas/service-setting.schema';

export const PERFORMER_MODEL_PROVIDER = 'PERFORMER_MODEL';
export const PERFORMER_PROFILE_IMAGE_MODEL_PROVIDER = 'PERFORMER_PROFILE_IMAGE_MODEL_PROVIDER';
export const PERFORMER_SERVICE_SETTING_MODEL_PROVIDER = 'PERFORMER_SERVICE_SETTING_MODEL_PROVIDER';

export const performerProviders = [
  {
    provide: PERFORMER_MODEL_PROVIDER,
    useFactory: (connection: Connection) => connection.model('Performer', PerformerSchema),
    inject: [MONGO_DB_PROVIDER]
  },
  {
    inject: [MONGO_DB_PROVIDER],
    provide: PERFORMER_PROFILE_IMAGE_MODEL_PROVIDER,
    useFactory: (connection: Connection) => connection.model(
      'PerformerProfileImage',
      PerformerProfileImageSchema
    )
  },
  {
    inject: [MONGO_DB_PROVIDER],
    provide: PERFORMER_SERVICE_SETTING_MODEL_PROVIDER,
    useFactory: (connection: Connection) => connection.model('PerformerServiceSetting', ServiceSettingSchema)
  }
];
