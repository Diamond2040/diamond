import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { Model } from 'mongoose';
import { StringHelper, EntityNotFoundException } from 'src/kernel';
import { MailerService } from 'src/modules/mailer';
import { ConfigService } from 'nestjs-config';

import { UserService } from 'src/modules/user/services';
import { UserModel } from 'src/modules/user/models';
import { UserDto } from 'src/modules/user/dtos';
import { PerformerService } from 'src/modules/performer/services';
import { VERIFICATION_MODEL_PROVIDER } from '../providers/auth.provider';
import { VerificationModel } from '../models';

@Injectable()
export class VerificationService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => PerformerService))
    private readonly performerService: PerformerService,
    @Inject(VERIFICATION_MODEL_PROVIDER)
    private readonly verificationModel: Model<VerificationModel>,
    private readonly mailService: MailerService,
    private readonly config: ConfigService
  ) {}

  async sendVerificationEmail(source: UserModel | UserDto): Promise<void> {
    let verification = await this.verificationModel.findOne({
      sourceId: source._id,
      value: source.email
    });
    if (!verification) {
      // eslint-disable-next-line new-cap
      verification = new this.verificationModel();
    }
    const token = StringHelper.randomString(15);
    verification.set('sourceId', source._id);
    verification.set('sourceType', 'user');
    verification.set('value', source.email);
    verification.set('token', token);
    await verification.save();
    const verificationLink = new URL(
      `auth/email-verification?token=${token}`,
      this.config.get('app.baseUrl')
    ).href;
    await this.mailService.send({
      to: source.email,
      subject: 'Verify your email address',
      data: {
        verificationLink
      },
      template: 'email-verification'
    });
  }

  async verifyEmail(token: string): Promise<void> {
    const verification = await this.verificationModel.findOne({
      token
    });
    if (!verification) {
      throw new EntityNotFoundException();
    }
    verification.verified = true;
    await verification.save();
    await this.userService.updateVerificationStatus(verification.sourceId);

    // check performer and update as well
    await this.performerService.updateEmailVerify(verification.sourceId);
  }

  getEmailVerifiedMessage(): string {
    return 'Thank you. Your email has been verified. You can close and login to system now';
  }
}
