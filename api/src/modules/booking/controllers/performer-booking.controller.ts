import {
  Controller,
  Injectable,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Get,
  Query,
  UseGuards,
  Param,
  Post
} from '@nestjs/common';
import { DataResponse, PageableData } from 'src/kernel';
import { CurrentUser, Roles } from 'src/modules/auth';
import { RoleGuard } from 'src/modules/auth/guards';
import { UserDto } from 'src/modules/user/dtos';
import { BookingDto } from '../dtos';
import { BookingSearchRequest } from '../payloads';
import { BookingService } from '../services';

@Injectable()
@Controller('booking/performer')
export class PerformerBookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get('/search')
  @Roles('performer')
  @UseGuards(RoleGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async getMyBookings(
    @Query() query: BookingSearchRequest,
    @CurrentUser() user: UserDto
  ): Promise<DataResponse<PageableData<BookingDto>>> {
    const data = await this.bookingService.getByDateRanges({ ...query, targetId: user._id });
    return DataResponse.ok(data);
  }

  @Get('/:id')
  @Roles('performer')
  @UseGuards(RoleGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async detail(@Param('id') id: string, @CurrentUser() user: UserDto): Promise<DataResponse<BookingDto>> {
    const data = await this.bookingService.performerGetDetail(id, user);
    return DataResponse.ok(data);
  }

  @Post('/:id/approve')
  @Roles('performer')
  @UseGuards(RoleGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async accept(@Param('id') id: string, @CurrentUser() user: UserDto) {
    await this.bookingService.accept(id, user);
    return DataResponse.ok({ success: true });
  }

  @Post('/:id/reject')
  @Roles('performer')
  @UseGuards(RoleGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async reject(@Param('id') id: string, @CurrentUser() user: UserDto) {
    await this.bookingService.reject(id, user);
    return DataResponse.ok({ success: true });
  }

  @Post('/:id/dismiss')
  @Roles('performer')
  @UseGuards(RoleGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async dismiss(@Param('id') id: string, @CurrentUser() user: UserDto) {
    await this.bookingService.updateStatus(id, user, 'pending');
    return DataResponse.ok({ success: true });
  }

  @Post('/dismiss')
  @Roles('performer')
  @UseGuards(RoleGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async dismissAll(@CurrentUser() user: UserDto) {
    await this.bookingService.dismissAllBooking(user);
    return DataResponse.ok({ success: true });
  }
}
