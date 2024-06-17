import {
  Controller,
  Injectable,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Post,
  Param
} from '@nestjs/common';
import { RoleGuard } from 'src/modules/auth/guards';
import {
  DataResponse, EntityNotFoundException
} from 'src/kernel';
import { CurrentUser, Roles } from 'src/modules/auth';
import { UserDto } from 'src/modules/user/dtos';
import { PerformerService } from 'src/modules/performer/services';
import { SubscriptionService } from '../services/subscription.service';
import { CancelSubscriptionService } from '../services/cancel-subscription.service';

@Injectable()
@Controller('subscriptions/cancel')
export class CancelSubscriptionController {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly cancelSubscriptionService: CancelSubscriptionService,
    private readonly performerService: PerformerService
  ) {}

  @Post('/admin/:id')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async adminCancel(
    @Param('id') id: string
  ): Promise<DataResponse<any>> {
    // force expired for non-recurring
    const data = await this.cancelSubscriptionService.cancelSubscription(id, true);
    return DataResponse.ok(data);
  }

  @Post('/')
  @HttpCode(HttpStatus.OK)
  @Roles('performer')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async userCancel(
    @CurrentUser() user: UserDto
  ): Promise<DataResponse<any>> {
    const performer = await this.performerService.findByUserId(user._id);
    if (!performer) throw new EntityNotFoundException();
    const subscription = await this.subscriptionService.findOne({ userId: performer._id });
    if (!subscription) throw new EntityNotFoundException();
    const id = subscription.subscriptionId || subscription._id.toString();
    const data = await this.cancelSubscriptionService.cancelSubscription(id);
    return DataResponse.ok(data);
  }
}
