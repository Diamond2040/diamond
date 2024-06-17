import { Module, forwardRef } from '@nestjs/common';
import { MongoDBModule } from 'src/kernel';
import { AuthModule } from '../auth/auth.module';
import { MailerModule } from '../mailer/mailer.module';
import { SettingModule } from '../settings/setting.module';
import { UserModule } from '../user/user.module';
import { PerformerAbuseReportController } from './controllers';
import { abuseReportProvider } from './providers';
import { PerformerAbuseReportService } from './services';

@Module({
  imports: [
    MongoDBModule,
    MailerModule,
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
    forwardRef(() => SettingModule)
  ],
  providers: [abuseReportProvider, PerformerAbuseReportService],
  controllers: [PerformerAbuseReportController]
})
export class AbuseReportModule {}
