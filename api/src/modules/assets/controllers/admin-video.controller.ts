import {
  Controller,
  Injectable,
  UseGuards,
  Body,
  Post,
  HttpCode,
  HttpStatus,
  Request,
  Get,
  Param,
  Query,
  UseInterceptors,
  Delete
} from '@nestjs/common';
import { RoleGuard } from 'src/modules/auth/guards';
import { DataResponse, getConfig } from 'src/kernel';
import { CurrentUser, Roles } from 'src/modules/auth';
import { MultiFileUploadInterceptor, FilesUploaded } from 'src/modules/file';
import { UserDto } from 'src/modules/user/dtos';
import { VideoCreatePayload } from '../payloads/video-create.payload';
import { VideoService } from '../services/video.service';
import { VideoSearchRequest, VideoUpdatePayload } from '../payloads';
import { VideoSearchService } from '../services/video-search.service';

@Injectable()
@Controller('admin/assets/videos')
export class AdminPerformerVideosController {
  constructor(
    private readonly videoService: VideoService,
    private readonly videoSearchService: VideoSearchService
  ) {}

  @Post('/upload')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UseInterceptors(
    // TODO - check and support multiple files!!!
    MultiFileUploadInterceptor(
      [
        {
          type: 'performer-video',
          fieldName: 'video',
          options: {
            destination: getConfig('file').videoProtectedDir
          }
        },
        {
          type: 'performer-video-teaser',
          fieldName: 'teaser',
          options: {
            destination: getConfig('file').videoDir
          }
        },
        {
          type: 'performer-video-thumbnail',
          fieldName: 'thumbnail',
          options: {
            destination: getConfig('file').imageDir,
            generateThumbnail: true,
            replaceWithThumbail: true,
            thumbnailSize: getConfig('image').videoThumbnail
          }
        }
      ],
      {}
    )
  )
  async uploadVideo(
    @FilesUploaded() files: Record<string, any>,
    @Body() payload: VideoCreatePayload,
    @CurrentUser() user: UserDto
  ): Promise<any> {
    const resp = await this.videoService.create(
      files,
      payload,
      user
    );
    return DataResponse.ok(resp);
  }

  @Get('/:id/view')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  async details(
    @Param('id') id: string,
    @Request() req: any
  ) {
    const jwToken = req.jwToken || null;
    const details = await this.videoService.getDetails(id, jwToken);
    return DataResponse.ok(details);
  }

  @Get('/search')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  async search(@Query() req: VideoSearchRequest) {
    const resp = await this.videoSearchService.adminSearch(req);
    return DataResponse.ok(resp);
  }

  @Post('/:id')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UseInterceptors(
    // TODO - check and support multiple files!!!
    MultiFileUploadInterceptor(
      [
        {
          type: 'performer-video',
          fieldName: 'video',
          options: {
            destination: getConfig('file').videoProtectedDir
          }
        },
        {
          type: 'performer-video-teaser',
          fieldName: 'teaser',
          options: {
            destination: getConfig('file').videoDir
          }
        },
        {
          type: 'performer-video-thumbnail',
          fieldName: 'thumbnail',
          options: {
            destination: getConfig('file').imageDir,
            generateThumbnail: true,
            replaceWithThumbail: true,
            thumbnailSize: getConfig('image').videoThumbnail
          }
        }
      ],
      {}
    )
  )
  async update(
    @Param('id') id: string,
    @FilesUploaded() files: Record<string, any>,
    @Body() payload: VideoUpdatePayload,
    @CurrentUser() updater: UserDto
  ) {
    const details = await this.videoService.updateInfo(id, files, payload, updater);
    return DataResponse.ok(details);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  async remove(
    @Param('id') id: string
  ) {
    const details = await this.videoService.delete(id);
    return DataResponse.ok(details);
  }
}
