import { Module, HttpModule, forwardRef } from '@nestjs/common';
import { SettingModule } from 'src/modules/settings/setting.module';
import {
  CountryService,
  LanguageService,
  PhoneCodeService,
  UserAdditionalInfoService
} from './services';
import {
  CountryController,
  LanguageController,
  PhoneCodeController,
  UserAdditionalInfoController
} from './controllers';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5
    }),
    forwardRef(() => AuthModule),
    forwardRef(() => SettingModule)
  ],
  controllers: [
    CountryController,
    LanguageController,
    PhoneCodeController,
    UserAdditionalInfoController
  ],
  providers: [
    CountryService, LanguageService, PhoneCodeService,
    UserAdditionalInfoService
  ],
  exports: [CountryService, LanguageService, PhoneCodeService]
})
export class UtilsModule {}
