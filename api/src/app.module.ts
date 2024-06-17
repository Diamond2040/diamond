import { Module } from '@nestjs/common';
import { ConfigModule } from 'nestjs-config';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { SettingModule } from './modules/settings/setting.module';
import { MailerModule } from './modules/mailer/mailer.module';
import { PostModule } from './modules/post/post.module';
import { FileModule } from './modules/file/file.module';
import { PerformerModule } from './modules/performer/performer.module';
import { UtilsModule } from './modules/utils/utils.module';
import { AssetsModule } from './modules/assets/assets.module';
import { ReactionModule } from './modules/reaction/reaction.module';
import { PaymentModule } from './modules/payment/payment.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { BannerModule } from './modules/banner/banner.module';
import { SocketModule } from './modules/socket/socket.module';
import { ContactModule } from './modules/contact/contact.module';
import { StatisticModule } from './modules/statistic/statistic.module';
import { CategoryModule } from './modules/category/category.module';
import { CommentModule } from './modules/comment/comment.module';
import { SearchModule } from './modules/search/search.module';
import { ReviewModule } from './modules/review/review.module';
import { PerformerScheduleModule } from './modules/performer-schedule/performer-schedule.module';
import { BookingModule } from './modules/booking/booking.module';
import { MessageModule } from './modules/message/message.module';
import { AbuseReportModule } from './modules/abuse-report/report.module';

@Module({
  imports: [
    ConfigModule.resolveRootPath(__dirname).load('config/**/!(*.d).{ts,js}'),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public')
    }),
    AuthModule,
    UserModule,
    PostModule,
    SettingModule,
    MailerModule,
    FileModule,
    UtilsModule,
    PerformerModule,
    AssetsModule,
    ReactionModule,
    PaymentModule,
    SubscriptionModule,
    BannerModule,
    SocketModule,
    ContactModule,
    StatisticModule,
    CategoryModule,
    CommentModule,
    SearchModule,
    ReviewModule,
    PerformerScheduleModule,
    BookingModule,
    MessageModule,
    AbuseReportModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}

export default AppModule;
