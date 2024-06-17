import {
  Controller,
  Injectable,
  UseGuards,
  Body,
  Post,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Put,
  Get,
  Param,
  Query,
  Request
} from '@nestjs/common';
import { RoleGuard } from 'src/modules/auth/guards';
import { DataResponse, EntityNotFoundException, PageableData } from 'src/kernel';
import { CurrentUser, Roles } from 'src/modules/auth';
import { UserDto } from 'src/modules/user/dtos';
import {
  PerformerCreatePayload,
  PerformerUpdatePayload,
  PerformerSearchPayload
} from '../payloads';
import { PerformerDto, IPerformerResponse } from '../dtos';
import { PerformerService, PerformerSearchService } from '../services';

@Injectable()
@Controller('admin/performers')
export class AdminPerformerController {
  constructor(
    private readonly performerService: PerformerService,
    private readonly performerSearchService: PerformerSearchService
  ) {}

  @Get('/search')
  @Roles('admin')
  @UseGuards(RoleGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async search(
    @Query() req: PerformerSearchPayload
  ): Promise<DataResponse<PageableData<IPerformerResponse>>> {
    const data = await this.performerSearchService.adminSearch(req);
    return DataResponse.ok(data);
  }

  @Post()
  @Roles('admin')
  @UseGuards(RoleGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(
    @CurrentUser() currentUser: UserDto,
    @Body() payload: PerformerCreatePayload
  ): Promise<DataResponse<PerformerDto>> {
    const performer = await this.performerService.create(payload, currentUser);

    return DataResponse.ok(performer);
  }

  @Put('/:id')
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async updatePerformer(
    @Body() payload: PerformerUpdatePayload,
    @Param('id') performerId: string
  ): Promise<DataResponse<any>> {
    const data = await this.performerService.update(performerId, payload);
    return DataResponse.ok(data);
  }

  @Get('/:id/view')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  async getDetails(
    @Param('id') performerId: string,
    @Request() req: any
  ): Promise<DataResponse<IPerformerResponse>> {
    const { jwtToken } = req;
    const performer = await this.performerService.getDetails(performerId, {
      responseDocument: true,
      jwtToken
    });
    // TODO - check roles or other to response info
    const data = performer.toResponse(true, true);
    return DataResponse.ok(data);
  }

  @Get('/by-users/:userId')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  async getDetailsByUserId(
    @Param('userId') userId: string,
    @Request() req: any
  ): Promise<DataResponse<any>> {
    const performer = await this.performerService.findByUserId(userId);
    if (!performer) throw new EntityNotFoundException();
    const details = await this.performerService.getDetails(performer._id, {
      responseDocument: true,
      jwtToken: req.jwtToken
    });
    return DataResponse.ok(details.toResponse(true, true));
  }
}
