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
  Param,
  Request
} from '@nestjs/common';
import { RoleGuard } from 'src/modules/auth/guards';
import { DataResponse } from 'src/kernel';
import { Roles } from 'src/modules/auth';
import { ServiceSettingPayload } from '../payloads/service-setting-update.payload';
import { PerformerServiceSettingService } from '../services/performer-service-setting.service';
import { PerformerService } from '../services';

@Injectable()
@Controller('performer-services')
export class PerformerServiceController {
  constructor(
    private readonly settingService: PerformerServiceSettingService,
    private readonly performerService: PerformerService
  ) {}

  @Put('/')
  @Roles('performer')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async updatePerformer(
    @Body() payload: ServiceSettingPayload,
    @Request() req: any
  ): Promise<DataResponse<any>> {
    const { sourceId } = req.authUser;
    const performer = await this.performerService.findByUserId(sourceId);
    const data = await this.settingService.update(performer._id, payload);
    return DataResponse.ok(data);
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @Roles('performer')
  @UseGuards(RoleGuard)
  async getList(@Request() req: any): Promise<DataResponse<any>> {
    const { sourceId } = req.authUser;
    const performer = await this.performerService.findByUserId(sourceId);
    const data = await this.settingService.getListSettings(performer._id);

    return DataResponse.ok(data);
  }

  @Get('/groups/:groupId')
  @HttpCode(HttpStatus.OK)
  @Roles('performer')
  @UseGuards(RoleGuard)
  async getByGroup(
    @Request() req: any,
    @Param('group') group: string
  ): Promise<DataResponse<any>> {
    const { sourceId } = req.authUser;
    const performer = await this.performerService.findByUserId(sourceId);
    const data = await this.settingService.getSettingsByGroup(performer._id, group);

    return DataResponse.ok(data);
  }
}
