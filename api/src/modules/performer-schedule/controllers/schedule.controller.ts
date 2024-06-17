import {
  Body, Controller, Delete, Get, HttpCode,
  Param, Post, Put, UseGuards, UsePipes,
  ValidationPipe, Query, HttpStatus
} from '@nestjs/common';
import { DataResponse, PageableData } from 'src/kernel';
import { Roles, CurrentUser } from 'src/modules/auth';
import { RoleGuard } from 'src/modules/auth/guards';
import { UserDto } from 'src/modules/user/dtos';
import { STATUS } from 'src/kernel/constants';
import { PerformerScheduleDto } from '../dtos';
import { CreateSchedulePayload, UpdateSchedulePayload, SearchSchedulePayload } from '../payloads';
import { ScheduleService } from '../services';

@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) { }

  @Post('/')
  @Roles('performer')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true, forbidNonWhitelisted: true }))
  async create(
    @Body() payload: CreateSchedulePayload,
    @CurrentUser() creator: UserDto
  ): Promise<DataResponse<PerformerScheduleDto>> {
    const result = await this.scheduleService.create(payload, creator);
    return DataResponse.ok(result);
  }

  @Get('/search')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async userSearch(
    @Query() req: SearchSchedulePayload
  ): Promise<DataResponse<PageableData<PerformerScheduleDto>>> {
    const data = await this.scheduleService.search({ ...req, status: STATUS.ACTIVE });
    return DataResponse.ok(data);
  }

  @Get('')
  @Roles('performer')
  @UseGuards(RoleGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async search(
    @Query() query: SearchSchedulePayload,
    @CurrentUser() user: UserDto
  ): Promise<DataResponse<PageableData<PerformerScheduleDto>>> {
    const req = { ...query, userId: user._id };
    const data = await this.scheduleService.search(req);
    return DataResponse.ok(data);
  }

  @Get('/:id/view')
  @UsePipes(new ValidationPipe({ transform: true }))
  async details(
    @Param('id') id: string
  ): Promise<DataResponse<PerformerScheduleDto>> {
    const result = await this.scheduleService.findOne(id);
    return DataResponse.ok(result);
  }

  @Put('/:id')
  @Roles('performer')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true, forbidNonWhitelisted: true }))
  async update(
    @Param('id') id: string,
    @Body() payload: UpdateSchedulePayload,
    @CurrentUser() creator: UserDto
  ): Promise<DataResponse<PerformerScheduleDto>> {
    const result = await this.scheduleService.update(id, payload, creator);
    return DataResponse.ok(result);
  }

  @Delete('/:id')
  @Roles('performer')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async delete(@Param('id') id: string, @CurrentUser() creator: UserDto) {
    const result = await this.scheduleService.delete(id, creator);
    return DataResponse.ok(result);
  }
}
