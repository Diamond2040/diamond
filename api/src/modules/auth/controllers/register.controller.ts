import {
  Post,
  HttpCode,
  HttpStatus,
  Body,
  Controller,
  Get,
  Res,
  Query,
  ValidationPipe,
  UsePipes
} from '@nestjs/common';
import { UserService } from 'src/modules/user/services';
import { DataResponse } from 'src/kernel';
import { UserCreatePayload } from 'src/modules/user/payloads';
import { SettingService } from 'src/modules/settings';
import { STATUS_PENDING_EMAIL_CONFIRMATION, STATUS_ACTIVE, ROLE_USER } from 'src/modules/user/constants';
import { OrderService, PaymentService } from 'src/modules/payment/services';
import { AuthCreateDto } from '../dtos';
import { UserRegisterPayload } from '../payloads';
import { VerificationService, AuthService } from '../services';

@Controller('auth')
export class RegisterController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly verificationService: VerificationService,
    private readonly orderService: OrderService,
    private readonly paymentService: PaymentService
  ) {}

  @Post('users/register')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async userRegister(
    @Body() req: UserRegisterPayload
  ): Promise<DataResponse<{ message: string }>> {
    const requireEmailVerification = SettingService.getValueByKey(
      'requireEmailVerification'
    );

    const user = await this.userService.create(new UserCreatePayload(req), {
      status: requireEmailVerification
        ? STATUS_PENDING_EMAIL_CONFIRMATION
        : STATUS_ACTIVE,
      roles: ROLE_USER
    });

    await Promise.all([
      req.email
        && this.authService.create(
          new AuthCreateDto({
            source: 'user',
            sourceId: user._id,
            type: 'email',
            value: req.password,
            key: req.email
          })
        ),
      req.username
        && this.authService.create(
          new AuthCreateDto({
            source: 'user',
            sourceId: user._id,
            type: 'username',
            value: req.password,
            key: req.username
          })
        )
    ]);
    user.email && (await this.verificationService.sendVerificationEmail(user));

    // call subscription package and get ccbill redirect url
    if (req.subscriptionPackageId) {
      const data = await this.orderService.createForSubscription(
        { packageId: req.subscriptionPackageId },
        user as any
      );
      const { order, subscriptionPackage } = data;
      if (!order.totalPrice) {
        // process free subscription package, increase subscription time for user
        await this.paymentService.handlePaymentSuccess(order);
        // TODO - check config?
        return DataResponse.ok({
          message:
            'We have sent an email to verify your email, please check your inbox.'
        });
      }

      const info = subscriptionPackage.type === 'single'
        ? await this.paymentService.processSinglePayment(data)
        : await this.paymentService.processSubscriptionPayment(data);

      return DataResponse.ok({
        ...info,
        message:
          'We have sent an email to verify your email, please check your inbox.'
      });
    }

    return DataResponse.ok({
      message:
        'We have sent an email to verify your email, please check your inbox.'
    });
  }

  @Get('email-verification')
  public async verifyEmail(@Res() res: any, @Query('token') token: string) {
    if (!token) {
      return res.render('404.html');
    }
    await this.verificationService.verifyEmail(token);
    if (process.env.EMAIL_VERIFIED_SUCCESS_URL) {
      return res.redirect(process.env.EMAIL_VERIFIED_SUCCESS_URL);
    }

    return res.redirect(`${process.env.USER_URL}/auth/login`);
  }
}
