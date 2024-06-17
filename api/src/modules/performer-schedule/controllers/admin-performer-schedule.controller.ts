import {
  Body, Controller, Delete, Param, Post, Put, UseGuards, UsePipes, ValidationPipe
} from '@nestjs/common';
import { DataResponse } from 'src/kernel';
import { Roles } from 'src/modules/auth';
import { RoleGuard } from 'src/modules/auth/guards';
import { PerformerScheduleDto } from '../dtos';
import { AdminCreateSchedulePayload, AdminUpdateSchedulePayload } from '../payloads';
import { ScheduleService } from '../services';

@Controller('admin/schedules')
export class AdminPerformerScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post('/')
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true, forbidNonWhitelisted: true }))
  async create(
    @Body() payload: AdminCreateSchedulePayload
  ): Promise<DataResponse<PerformerScheduleDto>> {
    const result = await this.scheduleService.adminCreate(payload);
    return DataResponse.ok(result);
  }

  @Put('/:id')
  @Roles('performer')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true, forbidNonWhitelisted: true }))
  async update(
    @Param('id') id: string,
    @Body() payload: AdminUpdateSchedulePayload
  ): Promise<DataResponse<PerformerScheduleDto>> {
    const result = await this.scheduleService.adminUpdate(id, payload);
    return DataResponse.ok(result);
  }

  @Delete('/:id')
  @Roles('performer')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async delete(@Param('id') id: string) {
    const result = await this.scheduleService.adminDelete(id);
    return DataResponse.ok(result);
  }
}
