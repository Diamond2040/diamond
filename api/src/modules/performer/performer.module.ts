import { Module, forwardRef } from '@nestjs/common';
import { MongoDBModule, AgendaModule } from 'src/kernel';
import { UtilsModule } from 'src/modules/utils/utils.module';
import { AuthModule } from '../auth/auth.module';
import { SubscriptionModule } from '../subscription/subscription.module';
import { performerProviders } from './providers';
import {
  PerformerService,
  PerformerSearchService,
  PerformerProfileImageService
} from './services';
import {
  AdminPerformerController,
  AdminPerformerProfileImageController,
  PerformerController
} from './controllers';
import { UserModule } from '../user/user.module';
import { FileModule } from '../file/file.module';
import { AssetsModule } from '../assets/assets.module';
import { MailerModule } from '../mailer/mailer.module';
import { CategoryModule } from '../category/category.module';
import { PerformerProfileImageController } from './controllers/performer-profile-image.controller';
import { SyncUserIdPerformerListener } from './listeners/sync-user-id-to-profile.listener';
import { SyncOnlineListener } from './listeners/sync-online.listener';
import { AdminPerformerServiceController } from './controllers/admin-service-setting.controller';
import { PerformerServiceController } from './controllers/performer-service-setting.controller';
import { PerformerServiceSettingService } from './services/performer-service-setting.service';
import { ServiceSettingsController } from './controllers/service-setting.controller';
import { HandleReviewListener } from './listeners/handle-review.listener';
import { ReactionModule } from '../reaction/reaction.module';

@Module({
  imports: [
    MongoDBModule,
    AgendaModule.register(),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    forwardRef(() => FileModule),
    forwardRef(() => SubscriptionModule),
    forwardRef(() => AssetsModule),
    forwardRef(() => UtilsModule),
    forwardRef(() => MailerModule),
    forwardRef(() => CategoryModule),
    forwardRef(() => ReactionModule)
  ],
  providers: [
    ...performerProviders,
    PerformerService,
    PerformerSearchService,
    PerformerProfileImageService,
    PerformerServiceSettingService,
    SyncUserIdPerformerListener,
    SyncOnlineListener,
    HandleReviewListener
  ],
  controllers: [
    AdminPerformerController,
    PerformerController,
    AdminPerformerProfileImageController,
    PerformerProfileImageController,
    AdminPerformerServiceController,
    PerformerServiceController,
    ServiceSettingsController
  ],
  exports: [...performerProviders, PerformerService, PerformerSearchService]
})
export class PerformerModule {}
