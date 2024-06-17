import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { DataResponse, PageableData } from 'src/kernel';
import { CurrentUser, Roles } from 'src/modules/auth/decorators';
import { RoleGuard } from 'src/modules/auth/guards';
import { UserDto } from 'src/modules/user/dtos';
import { ReviewDto } from '../dtos';
import { CreateReviewPayload, SearchReviewPayload } from '../payloads';
import { ReviewService } from '../services/review.service';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @Roles('user', 'admin')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true, forbidNonWhitelisted: true }))
  async create(
    @Body() payload: CreateReviewPayload,
    @CurrentUser() currentUser: UserDto
  ): Promise<DataResponse<ReviewDto>> {
    const result = await this.reviewService.create(payload, currentUser._id);
    return DataResponse.ok(result);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, forbidNonWhitelisted: true }))
  async search(
    @Query() query: SearchReviewPayload
  ): Promise<DataResponse<PageableData<ReviewDto>>> {
    const result = await this.reviewService.search(query);
    return DataResponse.ok(result);
  }
}
