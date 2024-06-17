import {
  Controller,
  Injectable,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Get,
  UseGuards,
  Query,
  Post,
  Body,
  Delete,
  Param
} from '@nestjs/common';
import { RoleGuard } from 'src/modules/auth/guards';
import { DataResponse, EntityNotFoundException, PageableData } from 'src/kernel';
import { CurrentUser, Roles } from 'src/modules/auth';
import { PerformerService } from 'src/modules/performer/services';
import { UserDto } from 'src/modules/user/dtos';
import {
  SubscriptionCreatePayload,
  SubscriptionSearchRequestPayload
} from '../payloads';
import { SubscriptionDto } from '../dtos/subscription.dto';
import { SubscriptionService } from '../services/subscription.service';

@Injectable()
@Controller('subscriptions')
export class SubscriptionController {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly performerService: PerformerService
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(
    @Body() payload: SubscriptionCreatePayload
  ): Promise<DataResponse<SubscriptionDto>> {
    const data = await this.subscriptionService.adminCreate(payload);
    return DataResponse.ok(data);
  }

  @Get('/admin/search')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async adminSearch(
    @Query() req: SubscriptionSearchRequestPayload
  ): Promise<DataResponse<PageableData<SubscriptionDto>>> {
    const data = await this.subscriptionService.adminSearch(req);
    return DataResponse.ok(data);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  async delete(@Param('id') id: string): Promise<any> {
    const resp = await this.subscriptionService.delete(id);
    return DataResponse.ok(resp);
  }

  @Get('/performers/current')
  @HttpCode(HttpStatus.OK)
  @Roles('performer')
  @UseGuards(RoleGuard)
  async getCurrentSubscription(@CurrentUser() user: UserDto): Promise<any> {
    const performer = await this.performerService.findByUserId(user._id);
    if (!performer) throw new EntityNotFoundException();
    const resp = await this.subscriptionService.getCurrentSubscription(
      performer._id
    );
    return DataResponse.ok(resp);
  }

  @Get('/admin/performers/:id')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  async getPerformerSubscription(
    @Param('id') performerId: string
  ): Promise<any> {
    const resp = await this.subscriptionService.getCurrentSubscription(
      performerId
    );
    return DataResponse.ok(resp);
  }
}
