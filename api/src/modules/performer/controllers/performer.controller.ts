import {
  Controller,
  Injectable,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Get,
  Param,
  Query,
  HttpException,
  Put,
  Body,
  UseGuards,
  Request,
  Post
} from '@nestjs/common';
import { omit } from 'lodash';
import {
  DataResponse,
  PageableData
} from 'src/kernel';
import { CurrentUser, Roles } from 'src/modules/auth';
import { AuthGuard, LoadUser, RoleGuard } from 'src/modules/auth/guards';
import { ContactPayload } from 'src/modules/contact/payloads';
import { MailerService } from 'src/modules/mailer';
import { ReactionService } from 'src/modules/reaction/services/reaction.service';
import { UserDto } from 'src/modules/user/dtos';
import { PERFORMER_STATUSES, UNALLOWED_SELF_UPDATE_FIELDS } from '../constants';
import {
  PerformerDto,
  IPerformerResponse
} from '../dtos';
import {
  PerformerSearchPayload, PerformerUpdatePayload
} from '../payloads';
import { PerformerService, PerformerSearchService } from '../services';

@Injectable()
@Controller('performers')
export class PerformerController {
  constructor(
    private readonly performerService: PerformerService,
    private readonly performerSearchService: PerformerSearchService,
    private readonly mailService: MailerService,
    private readonly reactionService: ReactionService
  ) {}

  @Get('/search')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async usearch(
    @Query() req: PerformerSearchPayload
  ): Promise<DataResponse<PageableData<IPerformerResponse>>> {
    req.status = 'active';
    // default sort is score
    // req.sort = 'popular';
    const data = await this.performerSearchService.search(req);
    return DataResponse.ok(data);
  }

  @Get('/me')
  @HttpCode(HttpStatus.OK)
  @Roles('performer')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async getMyProfile(@Request() req: any): Promise<DataResponse<any>> {
    const { authUser, jwtToken } = req;
    const performer = await this.performerService.findByUserId(
      authUser.sourceId
    );
    const details = await this.performerService.getDetails(performer._id, {
      responseDocument: true,
      jwtToken
    });
    if (details.status === PERFORMER_STATUSES.INACTIVE) {
      throw new HttpException('This account is suspended', 403);
    }
    return DataResponse.ok(details.toResponse(true));
  }

  @Get('/:username')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LoadUser)
  async getDetails(
    @Param('username') performerUsername: string,
    @CurrentUser() user: UserDto
  ): Promise<DataResponse<Partial<PerformerDto>>> {
    const data = await this.performerService.findByUsername(performerUsername);

    if (data.status !== PERFORMER_STATUSES.ACTIVE) {
      throw new HttpException('This account is suspended', 403);
    }

    const dto = data.toPublicDetailsResponse() as any;
    if (user) {
      const hasBookmark = await this.reactionService.checkExisting(
        data._id,
        user._id,
        'favourite',
        'performer'
      );
      dto.favourited = hasBookmark;
    }

    return DataResponse.ok(dto);
  }

  @Put('/')
  @HttpCode(HttpStatus.OK)
  @Roles('performer')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateMyProfile(
    @Body() payload: PerformerUpdatePayload,
    @Request() req: any
  ): Promise<DataResponse<Partial<PerformerDto>>> {
    const { sourceId } = req.authUser;
    const performer = await this.performerService.findByUserId(sourceId);

    const data = await this.performerService.update(
      performer._id,

      // remove unwanted fields
      omit(payload, UNALLOWED_SELF_UPDATE_FIELDS)
    );

    return DataResponse.ok(data);
  }

  @Get('/:username/related')
  @HttpCode(HttpStatus.OK)
  async getRelated(
    @Param('username') username: string
  ): Promise<DataResponse<any>> {
    const data = await this.performerService.getRelated(username);
    return DataResponse.ok(data);
  }

  @Post('/:username/contact')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async contact(
    @Param('username') username: string,
    @Body() payload: ContactPayload
  ): Promise<DataResponse<any>> {
    const performer = await this.performerService.findByUsername(username);
    if (!performer || performer.status !== 'active') {
      return DataResponse.error(new Error("Model doesn't exists"));
    }
    await this.mailService.send({
      subject: `New contact from ${payload.name}`,
      to: performer.email,
      data: payload,
      template: 'contact-performer'
    });
    return DataResponse.ok(true);
  }

  @Get('/search/spotlight')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async searchSplotLight(@Query() query: PerformerSearchPayload) {
    const data = await this.performerSearchService.searchSplotLight(query);
    return DataResponse.ok(data);
  }
}
