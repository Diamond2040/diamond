import {
  Controller,
  Injectable,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Param,
  Get,
  Query,
  UseGuards,
  Request
} from '@nestjs/common';
import { DataResponse } from 'src/kernel';
import { AuthService, CurrentUser } from 'src/modules/auth';
import { LoadUser } from 'src/modules/auth/guards';
import { UserDto } from 'src/modules/user/dtos';
import { GallerySearchRequest } from '../payloads';
import { GalleryService } from '../services/gallery.service';

@Injectable()
@Controller('user/assets/galleries')
export class UserGalleryController {
  constructor(
    private readonly galleryService: GalleryService,
    private readonly authService: AuthService
  ) {}

  @Get('/search')
  @UseGuards(LoadUser)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async searchGallery(
    @Query() query: GallerySearchRequest,
    @Request() req: any
  ): Promise<any> {
    const auth = req.authUser && { _id: req.authUser.authId, source: req.authUser.source, sourceId: req.authUser.sourceId };
    const jwToken = auth && this.authService.generateJWT(auth, { expiresIn: 1 * 60 * 60 });
    const resp = await this.galleryService.userSearch(query, jwToken);
    return DataResponse.ok(resp);
  }

  @Get('/:id/view')
  @UseGuards(LoadUser)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async view(
    @Param('id') id: string,
    @CurrentUser() user: UserDto
  ): Promise<any> {
    const resp = await this.galleryService.details(id, user);
    return DataResponse.ok(resp);
  }
}
