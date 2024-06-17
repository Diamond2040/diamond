import {
  Controller,
  Injectable,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Query,
  Get
} from '@nestjs/common';
import { DataResponse, PageableData } from 'src/kernel';
import { SubscriptionPackageSearchService } from '../services';
import { SubscriptionPackageDto, ISubscriptionPackage } from '../dtos';
import { SubscriptionPackageSearchPayload } from '../payloads';

@Injectable()
@Controller('package')
export class SubscriptionPackageController {
  constructor(
    private readonly subscriptionPackageSearchService: SubscriptionPackageSearchService
  ) {}

  @Get('/subscription/search')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async search(@Query() req: SubscriptionPackageSearchPayload): Promise<DataResponse<PageableData<ISubscriptionPackage>>> {
    const data = await this.subscriptionPackageSearchService.userSearch(req);
    return DataResponse.ok({
      total: data.total,
      data: data.data.map((p) => new SubscriptionPackageDto(p).toResponse())
    });
  }
}
