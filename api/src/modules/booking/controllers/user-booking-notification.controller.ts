import {
  Controller, Get, Post, UseGuards
} from '@nestjs/common';
import { DataResponse } from 'src/kernel';
import { CurrentUser, Roles } from 'src/modules/auth';
import { RoleGuard } from 'src/modules/auth/guards';
import { UserDto } from 'src/modules/user/dtos';
import { UserBookingNotificationService } from '../services';

@Controller('booking/notification')
export class UserBookingNotificationController {
  constructor(private readonly notificatioService: UserBookingNotificationService) {}

  @Get('/search')
  @Roles('user')
  @UseGuards(RoleGuard)
  async search(@CurrentUser() currentUser: UserDto) {
    const data = await this.notificatioService.search(currentUser);
    return DataResponse.ok(data);
  }

  @Post('/dismiss')
  @Roles('user')
  @UseGuards(RoleGuard)
  async dismiss(@CurrentUser() currentUser: UserDto) {
    await this.notificatioService.dismissAll(currentUser);
    return DataResponse.ok();
  }
}
