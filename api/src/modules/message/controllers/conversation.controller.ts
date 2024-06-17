import {
  Controller,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Body,
  ForbiddenException,
  Post,
  Param,
  Query
} from '@nestjs/common';
import { DataResponse } from 'src/kernel';
import { AuthGuard } from 'src/modules/auth/guards';
import { toObjectId } from 'src/kernel/helpers/string.helper';
import { CurrentUser } from 'src/modules/auth';
import { CountryService } from 'src/modules/utils/services';
import { UserDto } from 'src/modules/user/dtos';
import { ConversationDto } from '../dtos';
import { ConversationService } from '../services/conversation.service';
import { ConversationCreatePayload, ConversationSearchPayload } from '../payloads';

@Controller('conversations')
export class ConversationController {
  constructor(
    private readonly countryService: CountryService,
    private readonly conversationService: ConversationService
  ) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async getListOfCurrentUser(
    @Query() query: ConversationSearchPayload,
    @CurrentUser() user: UserDto
  ): Promise<DataResponse<ConversationDto[]>> {
    const items = await this.conversationService.getList(query, {
      source: user.roles.includes('performer') ? 'performer' : 'user',
      sourceId: user._id
    });
    return DataResponse.ok(items);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async getDetails(
    @Param('id') conversationId: string,
    @CurrentUser() user: UserDto
  ): Promise<DataResponse<any>> {
    const data = await this.conversationService.loadConversation(conversationId, {
      source: user.roles.includes('performer') ? 'performer' : 'user',
      sourceId: user._id
    });
    return DataResponse.ok(new ConversationDto(data));
  }

  @Post('/')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async create(
    @Body() payload: ConversationCreatePayload,
    @CurrentUser() user: UserDto
  ) {
    if (payload.sourceId === user._id.toString()) {
      throw new ForbiddenException();
    }

    const sender = {
      source: user.roles.includes('performer') ? 'performer' : 'user',
      sourceId: user._id
    };
    const receiver = {
      source: payload.source,
      sourceId: toObjectId(payload.sourceId)
    };
    const conversation = await this.conversationService.createPrivateConversation(
      sender,
      receiver
    );

    return DataResponse.ok(conversation);
  }
}
