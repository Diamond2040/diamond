import {
  Controller, HttpCode, HttpStatus, UseGuards, Request,
  Post, UsePipes, ValidationPipe, Body, Get,
  Query, Param, Delete, UseInterceptors
} from '@nestjs/common';
import { DataResponse, getConfig } from 'src/kernel';
import { AuthGuard } from 'src/modules/auth/guards';
import { MultiFileUploadInterceptor, FilesUploaded } from 'src/modules/file';
import { CurrentUser } from 'src/modules/auth';
import { UserDto } from 'src/modules/user/dtos';
import { MessageService, NotificationMessageService } from '../services';
import {
  MessageListRequest, MessageCreatePayload, PrivateMessageCreatePayload
} from '../payloads';
import { MessageDto } from '../dtos';

@Controller('messages')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly notificationMessageService: NotificationMessageService
  ) { }

  @Post('/conversations/:conversationId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async createMessage(
    @Body() payload: MessageCreatePayload,
    @Param('conversationId') conversationId: string,
    @Request() req: any
  ): Promise<DataResponse<any>> {
    const data = await this.messageService.createPrivateMessage(
      conversationId,
      payload,
      {
        source: req.authUser.source,
        sourceId: req.authUser.sourceId
      }
    );
    return DataResponse.ok(data);
  }

  @Post('/private/file/:conversationId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @UseInterceptors(
    // TODO - check and support multiple files!!!
    MultiFileUploadInterceptor([
      {
        type: 'message-photo',
        fieldName: 'message-photo',
        options: {
          destination: getConfig('file').imageDir
        }
      }
    ])
  )
  async createPrivateFileMessage(
    @FilesUploaded() files: Record<string, any>,
    @Body() payload: PrivateMessageCreatePayload,
    @Request() req: any,
    @CurrentUser() user: UserDto,
    @Param('conversationId') conversationId: string
  ): Promise<DataResponse<MessageDto>> {
    const message = await this.messageService.createPrivateFileMessage(
      conversationId,
      {
        source: user.roles.includes('performer') ? 'performer' : 'user',
        sourceId: req.authUser.sourceId
      },
      files['message-photo'],
      payload
    );
    return DataResponse.ok(message);
  }

  @Post('/read-all/:conversationId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async readAllMessage(
    @Param('conversationId') conversationId: string,
    @CurrentUser() user: UserDto
  ): Promise<DataResponse<MessageDto>> {
    const message = await this.notificationMessageService.recipientReadAllMessageInConversation(user, conversationId);
    return DataResponse.ok(message);
  }

  @Get('/counting-not-read-messages')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async countTotalNotReadMessage(
    @CurrentUser() user: UserDto
  ): Promise<DataResponse<any>> {
    const data = await this.notificationMessageService.countTotalNotReadMessage(user._id.toString());
    return DataResponse.ok(data);
  }

  @Get('/conversations/:conversationId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async loadMessages(
    @Query() req: MessageListRequest,
    @Param('conversationId') conversationId: string,
    @CurrentUser() user: UserDto
  ): Promise<DataResponse<any>> {
    req.conversationId = conversationId;
    const data = await this.messageService.loadMessages(req, user);
    return DataResponse.ok(data);
  }

  @Delete('/:messageId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async deletePublicMessage(
    @Param('messageId') messageId: string,
    @CurrentUser() user: UserDto
  ): Promise<DataResponse<any>> {
    const data = await this.messageService.deleteMessage(
      messageId,
      user
    );
    return DataResponse.ok(data);
  }
}
