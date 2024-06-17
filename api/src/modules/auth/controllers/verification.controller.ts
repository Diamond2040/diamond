import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post
} from '@nestjs/common';
import { DataResponse } from 'src/kernel';
import { UserService } from 'src/modules/user/services';
import { UserDto } from 'src/modules/user/dtos';
import { VerificationService } from '..';

@Controller('verification')
export class VerificationController {
  constructor(
    private readonly userService: UserService,
    private readonly verificationService: VerificationService
  ) {}

  @Post('/resend')
  @HttpCode(HttpStatus.OK)
  async resendVerificationEmail(
    @Body('email') email: string
  ) {
    const user = await this.userService.findByEmail(email) as any;
    if (!user) throw new HttpException('No account was found, please try again', 404);
    await this.verificationService.sendVerificationEmail(new UserDto(user));
    return DataResponse.ok({ success: true });
  }
}
