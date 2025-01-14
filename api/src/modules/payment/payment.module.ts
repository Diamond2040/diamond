import { MongoDBModule, QueueModule } from 'src/kernel';
import {
  Module, forwardRef, NestModule, MiddlewareConsumer
} from '@nestjs/common';
import { RequestLoggerMiddleware } from 'src/kernel/logger/request-log.middleware';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { PerformerModule } from '../performer/performer.module';
import { SubscriptionModule } from '../subscription/subscription.module';
import { AssetsModule } from '../assets/assets.module';
import { paymentProviders, orderProviders } from './providers';
import { SettingModule } from '../settings/setting.module';
import { MailerModule } from '../mailer/mailer.module';
import {
  CCBillService,
  PaymentService,
  CheckPaymentService,
  OrderService
} from './services';
import {
  PaymentController, OrderController, PaymentWebhookController
} from './controllers';
import { OrderListener } from './listeners';

@Module({
  imports: [
    MongoDBModule,
    QueueModule.forRoot(),
    // inject user module because we request guard from auth, need to check and fix dependencies if not needed later
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    forwardRef(() => PerformerModule),
    forwardRef(() => SettingModule),
    forwardRef(() => SubscriptionModule),
    forwardRef(() => AssetsModule),
    forwardRef(() => MailerModule)
  ],
  providers: [
    ...paymentProviders,
    ...orderProviders,
    PaymentService,
    CCBillService,
    CheckPaymentService,
    OrderService,
    OrderListener
  ],
  controllers: [PaymentController, OrderController, PaymentWebhookController],
  exports: [
    ...paymentProviders,
    ...orderProviders,
    PaymentService,
    CCBillService,
    CheckPaymentService,
    OrderService
  ]
})
export class PaymentModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestLoggerMiddleware)
      .forRoutes('/payment/ccbill/callhook');
  }
}
