import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { DataResponse, getConfig, PageableData } from 'src/kernel';
import { Roles } from 'src/modules/auth';
import { RoleGuard } from 'src/modules/auth/guards';
import { FileDto, FileUploaded, FileUploadInterceptor } from 'src/modules/file';
import { PerformerProfileImageDto } from '../dtos';
import {
  UpdatePerformerProfileImagePayload,
  UploadPerformerProfileImagePayload,
  SearchPerformerProfileImagePayload
} from '../payloads';
import { PerformerProfileImageService } from '../services';

@Controller('admin/performer-profile-images')
export class AdminPerformerProfileImageController {
  constructor(
    private readonly performerProfileImageService: PerformerProfileImageService
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UseInterceptors(
    FileUploadInterceptor('performer-profile-image', 'file', {
      destination: getConfig('file').imageDir,
      generateThumbnail: true,
      // replaceWithThumbail: true,
      thumbnailSize: getConfig('image').avatar
    })
  )
  @UsePipes(new ValidationPipe({ transform: true, forbidNonWhitelisted: true }))
  async upload(
    @FileUploaded() file: FileDto,
    @Body() payload: UploadPerformerProfileImagePayload
  ): Promise<DataResponse<PerformerProfileImageDto>> {
    const result = await this.performerProfileImageService.upload(
      file,
      payload
    );
    return DataResponse.ok(result);
  }

  @Put('/:id/update')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UseInterceptors(
    FileUploadInterceptor('performer-profile-image', 'file', {
      destination: getConfig('file').imageDir,
      generateThumbnail: true,
      // replaceWithThumbail: true,
      thumbnailSize: getConfig('image').avatar
    })
  )
  @UsePipes(new ValidationPipe({ transform: true, forbidNonWhitelisted: true }))
  async update(
    @Param('id') id: string,
    @FileUploaded() file: FileDto,
    @Body() payload: UpdatePerformerProfileImagePayload
  ): Promise<DataResponse<PerformerProfileImageDto>> {
    await this.performerProfileImageService.update(id, file, payload);
    const result = await this.performerProfileImageService.findOne(id);
    return DataResponse.ok(result);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  async delete(@Param('id') id: string) {
    await this.performerProfileImageService.delete(id);
    return DataResponse.ok({ success: true });
  }

  @Get('/performers/:performerId/all')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true, forbidNonWhitelisted: true }))
  async getAllProfileImages(
    @Param('performerId') performerId: string
  ): Promise<DataResponse<any>> {
    const results = await this.performerProfileImageService.getAllPerformerImages(performerId);
    return DataResponse.ok(results);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true, forbidNonWhitelisted: true }))
  async search(
    @Query() payload: SearchPerformerProfileImagePayload
  ): Promise<DataResponse<PageableData<PerformerProfileImageDto>>> {
    const results = await this.performerProfileImageService.search(payload);
    return DataResponse.ok(results);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true, forbidNonWhitelisted: true }))
  async findOne(
    @Param('id') id: string
  ): Promise<DataResponse<PerformerProfileImageDto>> {
    const result = await this.performerProfileImageService.findOne(id);
    return DataResponse.ok(result);
  }

  @Put('/:id/main')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true, forbidNonWhitelisted: true }))
  async setProfileImageToAvatar(
    @Param('id') id: string,
    @Body('performerId') performerId: string
  ): Promise<DataResponse<any>> {
    const result = await this.performerProfileImageService.setAvatar(
      performerId,
      id
    );
    return DataResponse.ok(result);
  }
}
