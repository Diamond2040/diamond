import {
  Controller,
  Injectable,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Get,
  Query,
  Param
} from '@nestjs/common';
import { DataResponse } from 'src/kernel';
import { CategoryService } from '../services';
import { CategorySearchRequest } from '../payloads/category-search.request';

@Injectable()
@Controller('user/categories')
export class UserCategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/search')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async getActiveProductCategories(
    @Query() req: CategorySearchRequest
  ): Promise<any> {
    req.status = 'active';
    const resp = await this.categoryService.search(req);
    return DataResponse.ok(resp);
  }

  @Get('/:id/view')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async getDetailsCategory(
    @Param('id') id: string
  ): Promise<any> {
    const resp = await this.categoryService.findByIdOrAlias(id);
    return DataResponse.ok(resp);
  }
}
