import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { DataResponse, PageableData } from 'src/kernel';
import { CurrentUser, Roles } from 'src/modules/auth/decorators';
import { RoleGuard } from 'src/modules/auth/guards';
import { PerformerDto } from 'src/modules/performer/dtos';
import { ReviewDto } from '../dtos';
import { SearchReviewPayload } from '../payloads';
import { ReviewService } from '../services/review.service';

@Controller('performer/reviews')
export class PerformerReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles('performer')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true, forbidNonWhitelisted: true }))
  async search(
    @Query() payload: SearchReviewPayload,
    @CurrentUser() currentUser: PerformerDto
  ): Promise<DataResponse<PageableData<ReviewDto>>> {
    const result = await this.reviewService.search({
      ...payload,
      sourceId: currentUser._id as any,
      source: 'performer'
    });
    return DataResponse.ok(result);
  }
}
