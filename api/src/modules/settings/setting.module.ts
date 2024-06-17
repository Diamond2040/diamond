import { Module, forwardRef } from '@nestjs/common';
import { MongoDBModule, QueueModule } from 'src/kernel';
import { MailerModule } from 'src/modules/mailer/mailer.module';
import { customAttributeProviders, menuProviders, settingProviders } from './providers';
import { MenuService, SettingService, CustomAttributeService } from './services';
import { SettingController } from './controllers/setting.controller';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { SettingFileUploadController } from './controllers/setting-file-upload.controller';
import { FileModule } from '../file/file.module';
import { AdminSettingController } from './controllers/admin-setting.controller';
import { MenuController } from './controllers/menu.controller';
import { AdminCustomAttributeController } from './controllers/admin-custom-attribute.controller';
import { CustomAttributeController } from './controllers/custom-attribute.controller';

@Module({
  imports: [
    QueueModule.forRoot(),
    MongoDBModule,
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    forwardRef(() => FileModule),
    forwardRef(() => MailerModule)
  ],
  providers: [
    ...settingProviders,
    ...menuProviders,
    ...customAttributeProviders,
    CustomAttributeService,
    SettingService,
    MenuService
  ],
  controllers: [
    SettingController,
    SettingFileUploadController,
    AdminSettingController,
    AdminCustomAttributeController,
    CustomAttributeController,
    MenuController
  ],
  exports: [...settingProviders, ...menuProviders, SettingService, MenuService]
})
export class SettingModule {
  constructor(private settingService: SettingService) {
    this.settingService.syncCache();
  }
}
