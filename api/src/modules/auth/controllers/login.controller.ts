import {
  Post,
  HttpCode,
  HttpStatus,
  Body,
  Controller,
  HttpException
} from '@nestjs/common';
import { UserService } from 'src/modules/user/services';
import { DataResponse } from 'src/kernel';
import { SettingService } from 'src/modules/settings';
import {
  STATUS_PENDING_EMAIL_CONFIRMATION, STATUS_INACTIVE
} from 'src/modules/user/constants';
import { PerformerService } from 'src/modules/performer/services';
import { PERFORMER_STATUSES } from 'src/modules/performer/constants';
import { LoginByEmailPayload, LoginByUsernamePayload } from '../payloads';
import { AuthService } from '../services';
import {
  PasswordIncorrectException, EmailNotVerifiedException, AccountNotFoundxception, AccountInactiveException
} from '../exceptions';

@Controller('auth')
export class LoginController {
  constructor(
    private readonly performerService: PerformerService,
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) { }

  @Post('login/email')
  @HttpCode(HttpStatus.OK)
  public async loginByEmail(
    @Body() req: LoginByEmailPayload
  ): Promise<DataResponse<{ token: string }>> {
    const user = await this.userService.findByEmail(req.email);
    if (!user) {
      throw new AccountNotFoundxception();
    }
    const requireEmailVerification = SettingService.getValueByKey('requireEmailVerification');
    if (
      (requireEmailVerification && user.status === STATUS_PENDING_EMAIL_CONFIRMATION) || (requireEmailVerification && !user.verifiedEmail)
    ) {
      throw new EmailNotVerifiedException();
    }
    if (user.status === STATUS_INACTIVE) {
      throw new AccountInactiveException();
    }
    const performer = await this.performerService.findByUserId(user._id);
    if (performer && performer.status === PERFORMER_STATUSES.WAIRING_FOR_REVIEW) {
      throw new HttpException('Please wait for the admin approval', 422);
    }
    const auth = await this.authService.findBySource({
      source: 'user',
      sourceId: user._id,
      type: 'email'
    });
    if (!auth) {
      throw new AccountNotFoundxception();
    }
    if (!this.authService.verifyPassword(req.password, auth)) {
      throw new PasswordIncorrectException();
    }
    return DataResponse.ok({
      token: this.authService.generateJWT(auth)
    });
  }

  @Post('login/username')
  @HttpCode(HttpStatus.OK)
  public async loginByUsername(
    @Body() req: LoginByUsernamePayload
  ): Promise<DataResponse<{ token: string }>> {
    const user = await this.userService.findByUsername(req.username);
    if (!user) {
      throw new AccountNotFoundxception();
    }
    const requireEmailVerification = SettingService.getValueByKey('requireEmailVerification');
    if ((requireEmailVerification && user.status === STATUS_PENDING_EMAIL_CONFIRMATION) || (requireEmailVerification && !user.verifiedEmail)) {
      throw new EmailNotVerifiedException();
    }
    if (user.status === STATUS_INACTIVE) {
      throw new AccountInactiveException();
    }
    const performer = await this.performerService.findByUserId(user._id);
    if (performer && performer.status === PERFORMER_STATUSES.WAIRING_FOR_REVIEW) {
      throw new HttpException('Please wait for the admin approval', 422);
    }
    const auth = await this.authService.findBySource({
      source: 'user',
      sourceId: user._id,
      type: 'username'
    });
    if (!auth) {
      throw new AccountNotFoundxception();
    }
    if (!this.authService.verifyPassword(req.password, auth)) {
      throw new PasswordIncorrectException();
    }
    return DataResponse.ok({
      token: this.authService.generateJWT(auth)
    });
  }
}
