import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Query
} from '@nestjs/common';
import { DataResponse } from 'src/kernel';
import { Roles } from 'src/modules/auth/decorators';
import { RoleGuard } from 'src/modules/auth/guards';
import { CustomAttributePayload, CustomAttributeSearchRequest } from '../payloads/custom-attribute.payload';
import { CustomAttributeService } from '../services/custom-attribute.service';

@Controller('admin/attributes')
export class AdminCustomAttributeController {
  constructor(private readonly attribubeService: CustomAttributeService) {}

  @Post('/')
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() payload: CustomAttributePayload) {
    const result = await this.attribubeService.create(payload);
    return DataResponse.ok(result);
  }

  @Get('/')
  @UsePipes(new ValidationPipe({ transform: true }))
  async search(@Query() req: CustomAttributeSearchRequest) {
    const results = await this.attribubeService.search(req);
    return DataResponse.ok(results);
  }

  @Put('/:id')
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(
    @Param('id') id: string,
    @Body() payload: CustomAttributePayload
  ) {
    const result = await this.attribubeService.update(id, payload);
    return DataResponse.ok(result);
  }

  @Delete('/:id')
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async delete(@Param('id') id: string) {
    await this.attribubeService.delete(id);
    return DataResponse.ok({ success: true });
  }

  @Get('/:id')
  @Roles('admin')
  @UsePipes(new ValidationPipe({ transform: true }))
  async findOne(@Param('id') id: string) {
    const results = await this.attribubeService.findById(id);
    return DataResponse.ok(results);
  }

  @Get('/groups/:groupId/all')
  @Roles('admin')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getAllByGroup(@Param('groupId') id: string) {
    const results = await this.attribubeService.findAllByGroup(id);
    return DataResponse.ok(results);
  }

  @Get('/groups/all')
  @Roles('admin')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getAllGroup() {
    const results = await this.attribubeService.findAll();
    return DataResponse.ok(results);
  }
}
