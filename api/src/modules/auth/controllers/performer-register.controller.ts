import {
  Post,
  HttpCode,
  HttpStatus,
  Body,
  Controller,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  HttpException
} from '@nestjs/common';
import { DataResponse, getConfig } from 'src/kernel';
import { FileDto, FilesUploaded, MultiFileUploadInterceptor } from 'src/modules/file';
import { MailerService } from 'src/modules/mailer';
import { PERFORMER_STATUSES } from 'src/modules/performer/constants';
import { PerformerService } from 'src/modules/performer/services';
import { SettingService } from 'src/modules/settings';
import { SETTING_KEYS } from 'src/modules/settings/constants';
import { VerificationService } from '..';
import { PerformerRegisterPayload } from '../payloads/performer-register.payload';

@Controller('auth')
export class PerformerRegisterController {
  constructor(
    private readonly performerService: PerformerService,
    private readonly mailService: MailerService,
    private readonly settingService: SettingService,
    private readonly verificationService: VerificationService
  ) {}

  @Post('performers/register')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(
    // TODO - check and support multiple files!!!
    MultiFileUploadInterceptor(
      [
        {
          type: 'performer-document',
          fieldName: 'idVerification',
          options: {
            destination: getConfig('file').documentDir
          }
        },
        {
          type: 'performer-document',
          fieldName: 'documentVerification',
          options: {
            destination: getConfig('file').documentDir
          }
        }
      ],
      {}
    )
  )
  async performerRegister(
    @Body() payload: PerformerRegisterPayload,
    @FilesUploaded() files: Record<string, FileDto>
  ): Promise<DataResponse<{ message: string }>> {
    if (!files.idVerification || !files.documentVerification) {
      throw new HttpException('Missing document!', 400);
    }

    let languages = [];
    let meetingWith = [];
    if (payload.languages) {
      languages = Array.isArray(payload.languages)
        ? payload.languages
        : [payload.languages];
    }
    if (payload.meetingWith) {
      meetingWith = Array.isArray(payload.meetingWith)
        ? payload.meetingWith
        : [payload.meetingWith];
    }
    const performer = await this.performerService.create({
      ...payload,
      languages,
      meetingWith,
      status: PERFORMER_STATUSES.WAIRING_FOR_REVIEW,
      idVerificationId: files.idVerification._id as any,
      documentVerificationId: files.documentVerification._id as any
    } as any);

    const [adminEmail, siteName] = await Promise.all([
      this.settingService.getKeyValue(SETTING_KEYS.ADMIN_EMAIL),
      this.settingService.getKeyValue(SETTING_KEYS.SITE_NAME)
    ]);

    await this.mailService.send({
      to: adminEmail,
      subject: `[${siteName}] New escort account has been registered`,
      data: performer,
      template: 'new-performer-registered'
    });

    // send email verificaiton
    await this.verificationService.sendVerificationEmail(performer as any);

    return DataResponse.ok({
      message:
        'We have sent an email to verify your email, please check your inbox.'
    });
  }
}
