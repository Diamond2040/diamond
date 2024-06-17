import {
  Controller,
  Injectable,
  UseGuards,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Put,
  Get,
  Param
} from '@nestjs/common';
import { RoleGuard } from 'src/modules/auth/guards';
import { DataResponse } from 'src/kernel';
import { Roles } from 'src/modules/auth';
import { ServiceSettingPayload } from '../payloads/service-setting-update.payload';
import { PerformerServiceSettingService } from '../services/performer-service-setting.service';

@Injectable()
@Controller('admin/performer-services')
export class AdminPerformerServiceController {
  constructor(
    private readonly settingService: PerformerServiceSettingService
  ) {}

  @Put('/performers/:performerId')
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async updatePerformer(
    @Body() payload: ServiceSettingPayload,
    @Param('performerId') performerId: string
  ): Promise<DataResponse<any>> {
    const data = await this.settingService.update(performerId, payload);
    return DataResponse.ok(data);
  }

  @Get('/performers/:performerId')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  async getList(
    @Param('performerId') performerId: string
  ): Promise<DataResponse<any>> {
    const data = await this.settingService.getListSettings(performerId);
    return DataResponse.ok(data);
  }

  @Get('/performers/:performerId/groups/:groupId')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  async getByGroup(
    @Param('performerId') performerId: string,
    @Param('group') group: string
  ): Promise<DataResponse<any>> {
    const data = await this.settingService.getSettingsByGroup(performerId, group);
    return DataResponse.ok(data);
  }
}
