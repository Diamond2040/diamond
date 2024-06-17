import {
  Controller,
  Injectable,
  UseGuards,
  Body,
  Post,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Get,
  Query,
  Param,
  Delete
} from '@nestjs/common';
import { RoleGuard } from 'src/modules/auth/guards';
import { DataResponse } from 'src/kernel';
import { CurrentUser, Roles } from 'src/modules/auth';
import { UserDto } from 'src/modules/user/dtos';
import { BookingCreatePayload, BookingSearchRequest } from '../payloads';
import { BookingDto } from '../dtos';
import { BookingService } from '../services';

@Injectable()
@Controller('booking')
export class UserBookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post('/')
  @Roles('user')
  @UseGuards(RoleGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, forbidNonWhitelisted: true }))
  async create(
    @Body() payload: BookingCreatePayload,
    @CurrentUser() user: UserDto
  ): Promise<DataResponse<BookingDto>> {
    const data = await this.bookingService.create(payload, user);
    return DataResponse.ok(data);
  }

  @Get('/')
  @Roles('user')
  @UseGuards(RoleGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async getMyBookings(
    @Query() query: BookingSearchRequest,
    @CurrentUser() user: UserDto
  ): Promise<DataResponse<any>> {
    const data = await this.bookingService.getByDateRanges({ ...query, fromSourceId: user._id });
    return DataResponse.ok(data);
  }

  @Get('/:id')
  @Roles('user')
  @UseGuards(RoleGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async detail(@Param('id') id: string, @CurrentUser() user: UserDto): Promise<DataResponse<BookingDto>> {
    const data = await this.bookingService.userGetDetail(id, user);
    return DataResponse.ok(data);
  }

  @Delete('/:id')
  @Roles('user')
  @UseGuards(RoleGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async delete(@Param('id') id: string, @CurrentUser() user: UserDto): Promise<DataResponse<any>> {
    const data = await this.bookingService.delete(id, user);
    return DataResponse.ok(data);
  }
}
