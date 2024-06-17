import { Module, HttpModule, forwardRef } from '@nestjs/common';
import {
  StatisticService
} from './services';
import {
  StatisticController
} from './controllers';
import { AuthModule } from '../auth/auth.module';
import { AssetsModule } from '../assets/assets.module';
import { PerformerModule } from '../performer/performer.module';
import { UserModule } from '../user/user.module';
import { SubscriptionModule } from '../subscription/subscription.module';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5
    }),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    forwardRef(() => PerformerModule),
    forwardRef(() => AssetsModule),
    forwardRef(() => SubscriptionModule),
    forwardRef(() => PaymentModule)
  ],
  providers: [StatisticService],
  controllers: [StatisticController],
  exports: [StatisticService]
})
export class StatisticModule {}
