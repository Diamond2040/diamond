import { Module, forwardRef, HttpModule } from '@nestjs/common';
import { AgendaModule, MongoDBModule, QueueModule } from 'src/kernel';
import { SubscriptionController } from './controllers/subscription.controller';
import { CancelSubscriptionController } from './controllers/cancel-subscription.controller';
import { SubscriptionService } from './services/subscription.service';
import { subscriptionProviders } from './providers/subscription.provider';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { OrderSubscriptionListener } from './listeners/order-subscription-update.listener';
import { CancelSubscriptionService } from './services/cancel-subscription.service';
import { SettingModule } from '../settings/setting.module';
import { SubscriptionPackageSearchService, SubscriptionPackageService } from './services';
import { AdminSubscriptionPackageController, SubscriptionPackageController } from './controllers';
import { PaymentModule } from '../payment/payment.module';
import { PerformerModule } from '../performer/performer.module';
import { ExpireSubscriptionJob } from './jobs/expire-subscription.job';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5
    }),
    QueueModule.forRoot(),
    MongoDBModule,
    AgendaModule.register(),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    forwardRef(() => SettingModule),
    forwardRef(() => PaymentModule),
    forwardRef(() => PerformerModule)
  ],
  providers: [
    ...subscriptionProviders,
    SubscriptionService,
    CancelSubscriptionService,
    OrderSubscriptionListener,
    SubscriptionPackageService,
    SubscriptionPackageSearchService,
    ExpireSubscriptionJob
  ],
  controllers: [
    SubscriptionController,
    CancelSubscriptionController,
    AdminSubscriptionPackageController,
    SubscriptionPackageController
  ],
  exports: [
    ...subscriptionProviders,
    SubscriptionService,
    CancelSubscriptionService,
    SubscriptionPackageService
  ]
})
export class SubscriptionModule {}
