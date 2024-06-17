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
  Delete
} from '@nestjs/common';
import { RoleGuard } from 'src/modules/auth/guards';
import { DataResponse, PageableData } from 'src/kernel';
import { CurrentUser, Roles } from 'src/modules/auth';
import { ReactionService } from '../services/reaction.service';
import { ReactionCreatePayload, ReactionSearchRequestPayload } from '../payloads';
import { ReactionDto } from '../dtos/reaction.dto';
import { UserDto } from '../../user/dtos';
import { REACTION } from '../constants';

@Injectable()
@Controller('reactions')
export class ReactionController {
  constructor(private readonly reactionService: ReactionService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @Roles('user')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(
    @CurrentUser() user: UserDto,
    @Body() payload: ReactionCreatePayload
  ): Promise<DataResponse<ReactionDto>> {
    const data = await this.reactionService.create(payload, user);
    return DataResponse.ok(data);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @Roles('user')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async remove(
    @CurrentUser() user: UserDto,
    @Body() payload: ReactionCreatePayload
  ): Promise<DataResponse<boolean>> {
    const data = await this.reactionService.remove(payload, user);
    return DataResponse.ok(data);
  }

  @Get('/videos/favourites')
  @HttpCode(HttpStatus.OK)
  @Roles('user')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async favouriteVideos(
    @Query() req: ReactionSearchRequestPayload,
    @CurrentUser() user: UserDto
  ): Promise<DataResponse<PageableData<ReactionDto>>> {
    req.action = REACTION.FAVOURITE;
    req.createdBy = user._id;
    const data = await this.reactionService.getListVideo(req);
    return DataResponse.ok(data);
  }

  @Get('/videos/watch-later')
  @HttpCode(HttpStatus.OK)
  @Roles('user')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async watchLaterVideos(
    @Query() req: ReactionSearchRequestPayload,
    @CurrentUser() user: UserDto
  ): Promise<DataResponse<PageableData<ReactionDto>>> {
    req.action = REACTION.WATCH_LATER;
    req.createdBy = user._id;
    const data = await this.reactionService.getListVideo(req);
    return DataResponse.ok(data);
  }

  @Get('/performers/favourites')
  @HttpCode(HttpStatus.OK)
  @Roles('user')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async favouritePerformers(
    @Query() req: ReactionSearchRequestPayload,
    @CurrentUser() user: UserDto
  ): Promise<DataResponse<PageableData<ReactionDto>>> {
    req.action = REACTION.FAVOURITE;
    req.createdBy = user._id;
    const data = await this.reactionService.getListPerformer(req);
    return DataResponse.ok(data);
  }
}
