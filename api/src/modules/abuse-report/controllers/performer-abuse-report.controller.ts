import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Param,
  Query
} from '@nestjs/common';
import { DataResponse, PageableData } from 'src/kernel';
import { Roles, CurrentUser } from 'src/modules/auth/decorators';
import { AuthGuard, RoleGuard } from 'src/modules/auth/guards';
import { UserDto } from 'src/modules/user/dtos';
import { AbuseReportResponse } from '../dtos';
import { PerformerAbuseReportPayload, PerformerAbuseReportSearchPayload } from '../payloads';
import { PerformerAbuseReportService } from '../services';

@Controller('abuse-report/performers')
export class PerformerAbuseReportController {
  constructor(private readonly reportService: PerformerAbuseReportService) {}

  @Post('/')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(
    @Body() payload: PerformerAbuseReportPayload,
    @CurrentUser() user: UserDto
  ): Promise<DataResponse<AbuseReportResponse>> {
    const result = await this.reportService.create(payload, user);
    return DataResponse.ok(result);
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async adminSearch(
    @Query() query: PerformerAbuseReportSearchPayload
  ): Promise<DataResponse<PageableData<AbuseReportResponse>>> {
    const results = await this.reportService.search(query);
    return DataResponse.ok(results);
  }

  @Get('/:id/view')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async adminGetAbuseReportDetail(
    @Param('id') id: string
  ): Promise<DataResponse<AbuseReportResponse>> {
    const result = await this.reportService.getAbuseReportById(id);
    return DataResponse.ok(result);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  async delete(@Param('id') id: string): Promise<DataResponse<any>> {
    await this.reportService.delete(id);
    return DataResponse.ok({ success: true });
  }
}
