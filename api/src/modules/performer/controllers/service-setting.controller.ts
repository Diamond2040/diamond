import {
  Controller,
  Injectable,
  UseGuards,
  HttpCode,
  HttpStatus,
  Get,
  Param
} from '@nestjs/common';
import { RoleGuard } from 'src/modules/auth/guards';
import { DataResponse } from 'src/kernel';
import { PerformerServiceSettingService } from '../services/performer-service-setting.service';

@Injectable()
@Controller('performer-services')
export class ServiceSettingsController {
  constructor(
    private readonly settingService: PerformerServiceSettingService
  ) {}

  @Get('/performers/:performerId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RoleGuard)
  async getList(
    @Param('performerId') performerId: string
  ): Promise<DataResponse<any>> {
    const data = await this.settingService.getListSettings(performerId);
    return DataResponse.ok(data);
  }
}
