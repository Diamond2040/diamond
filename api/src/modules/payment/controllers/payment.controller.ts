import {
  Controller,
  Injectable,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Post,
  Body
} from '@nestjs/common';
import { RoleGuard } from 'src/modules/auth/guards';
import { DataResponse, EntityNotFoundException } from 'src/kernel';
import { CurrentUser, Roles } from 'src/modules/auth';
import { PerformerService } from 'src/modules/performer/services';
import {
  SubscribePayload
} from '../payloads';
import { UserDto } from '../../user/dtos';
import { PaymentService } from '../services/payment.service';
import { OrderService } from '../services';

@Injectable()
@Controller('payment')
export class PaymentController {
  constructor(
    private readonly orderService: OrderService,
    private readonly paymentService: PaymentService,
    private readonly performerService: PerformerService
  ) {}

  @Post('/subscribe-performer')
  @HttpCode(HttpStatus.OK)
  @Roles('performer')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async subscribe(
    @CurrentUser() user: UserDto,
    @Body() payload: SubscribePayload
  ): Promise<DataResponse<any>> {
    const performer = await this.performerService.findByUserId(user._id);
    if (!performer) throw new EntityNotFoundException();
    // to purchase product, create new order then do the payment
    const data = await this.orderService.createForSubscription(payload, user, 'performer');
    const { order, subscriptionPackage } = data;
    if (!order.totalPrice) {
      // process free subscription package, increase subscription time for user
      await this.paymentService.handlePaymentSuccess(order);

      return DataResponse.ok(order);
    }
    const info = subscriptionPackage.type === 'single'
      ? await this.paymentService.processSinglePayment(data)
      : await this.paymentService.processSubscriptionPayment(data);
    return DataResponse.ok(info);
  }
}
