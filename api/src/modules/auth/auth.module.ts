import { Module, forwardRef } from '@nestjs/common';
import { MongoDBModule } from 'src/kernel';
import { authProviders } from './providers/auth.provider';
import { UserModule } from '../user/user.module';
import { AuthService, VerificationService } from './services';
import { MailerModule } from '../mailer/mailer.module';
import { AuthGuard, RoleGuard, LoadUser } from './guards';
import { RegisterController } from './controllers/register.controller';
import { LoginController } from './controllers/login.controller';
import { PasswordController } from './controllers/password.controller';
import { PaymentModule } from '../payment/payment.module';
import { PerformerRegisterController } from './controllers/performer-register.controller';
import { PerformerModule } from '../performer/performer.module';
import { SettingModule } from '../settings/setting.module';
import { FileModule } from '../file/file.module';
import { VerificationController } from './controllers/verification.controller';

@Module({
  imports: [
    MongoDBModule,
    forwardRef(() => UserModule),
    forwardRef(() => PerformerModule),
    forwardRef(() => MailerModule),
    forwardRef(() => SettingModule),
    forwardRef(() => PaymentModule),
    forwardRef(() => FileModule)
  ],
  providers: [
    ...authProviders,
    AuthService,
    VerificationService,
    AuthGuard,
    RoleGuard,
    LoadUser
  ],
  controllers: [
    RegisterController,
    PerformerRegisterController,
    LoginController,
    PasswordController,
    VerificationController
  ],
  exports: [
    ...authProviders,
    AuthService,
    VerificationService,
    AuthGuard,
    RoleGuard,
    LoadUser
  ]
})
export class AuthModule {}
