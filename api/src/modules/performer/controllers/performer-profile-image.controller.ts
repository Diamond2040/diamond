import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import {
  DataResponse, ForbiddenException, getConfig
} from 'src/kernel';
import { Roles } from 'src/modules/auth';
import { RoleGuard } from 'src/modules/auth/guards';
import { FileDto, FileUploaded, FileUploadInterceptor } from 'src/modules/file';
import { PerformerProfileImageDto } from '../dtos';
import { PerformerProfileImageService, PerformerService } from '../services';

@Controller()
export class PerformerProfileImageController {
  constructor(
    private readonly performerProfileImageService: PerformerProfileImageService,
    private readonly performerService: PerformerService
  ) {}

  @Post('/performers/me/profile-images')
  @HttpCode(HttpStatus.OK)
  @Roles('performer')
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
    @Request() req: any
  ): Promise<DataResponse<PerformerProfileImageDto>> {
    const { sourceId } = req.authUser;

    const performer = await this.performerService.findByUserId(sourceId);
    const result = await this.performerProfileImageService.upload(file, {
      performerId: performer._id
    } as any);
    return DataResponse.ok(result);
  }

  @Delete('/performers/me/profile-images/:id')
  @HttpCode(HttpStatus.OK)
  @Roles('performer')
  @UseGuards(RoleGuard)
  async delete(@Param('id') id: string, @Request() req: any) {
    const item = await this.performerProfileImageService.findOne(id);
    const { sourceId } = req.authUser;

    const performer = await this.performerService.findByUserId(sourceId);
    if (item.performerId.toString() !== performer._id.toString()) {
      throw new ForbiddenException();
    }
    await this.performerProfileImageService.delete(id);
    return DataResponse.ok({ success: true });
  }

  @Get('/performers/me/profile-images/all')
  @HttpCode(HttpStatus.OK)
  @Roles('performer')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true, forbidNonWhitelisted: true }))
  async getAllProfileImages(@Request() req: any): Promise<DataResponse<any>> {
    const { sourceId } = req.authUser;

    const performer = await this.performerService.findByUserId(sourceId);
    const results = await this.performerProfileImageService.getAllPerformerImages(
      performer._id
    );
    return DataResponse.ok(results);
  }

  @Get('/performers/me/profile-images/:id')
  @HttpCode(HttpStatus.OK)
  @Roles('performer')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true, forbidNonWhitelisted: true }))
  async findOne(
    @Param('id') id: string
  ): Promise<DataResponse<PerformerProfileImageDto>> {
    const result = await this.performerProfileImageService.findOne(id);
    return DataResponse.ok(result);
  }

  @Put('/performers/me/profile-images/:id/main')
  @HttpCode(HttpStatus.OK)
  @Roles('performer')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true, forbidNonWhitelisted: true }))
  async setProfileImageToAvatar(
    @Param('id') id: string,
    @Request() req: any
  ): Promise<DataResponse<any>> {
    const { sourceId } = req.authUser;

    const performer = await this.performerService.findByUserId(sourceId);
    const result = await this.performerProfileImageService.setAvatar(
      performer._id,
      id
    );
    return DataResponse.ok(result);
  }

  @Get('/performers/:performerId/profile-images/all')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, forbidNonWhitelisted: true }))
  async getAllProfileImagesOfPerformer(
    @Param('performerId') performerId: string
  ): Promise<DataResponse<any>> {
    const results = await this.performerProfileImageService.getAllPerformerImages(
      performerId
    );
    return DataResponse.ok(results);
  }
}
