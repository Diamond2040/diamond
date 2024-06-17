import {
  HttpCode,
  HttpStatus,
  Controller,
  Get,
  Injectable,
  UseGuards,
  Request,
  Body,
  Put
} from '@nestjs/common';
import { AuthGuard } from 'src/modules/auth/guards';
import { CurrentUser } from 'src/modules/auth/decorators';
import { DataResponse } from 'src/kernel';
import { UserService } from '../services';
import { UserDto, IUserResponse } from '../dtos';
import { UserUpdatePayload } from '../payloads';

@Injectable()
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService
  ) {}

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async me(
    @Request() req: any
  ): Promise<DataResponse<IUserResponse>> {
    const { authUser } = req;
    const data = await this.userService.getMe(authUser.sourceId);
    return DataResponse.ok(data);
  }

  @Put()
  @UseGuards(AuthGuard)
  async updateMe(
    @CurrentUser() currentUser: UserDto,
    @Body() payload: UserUpdatePayload
  ): Promise<DataResponse<IUserResponse>> {
    await this.userService.update(currentUser._id, payload, currentUser);

    const user = await this.userService.findById(currentUser._id);
    return DataResponse.ok(new UserDto(user).toResponse(true));
  }
}
