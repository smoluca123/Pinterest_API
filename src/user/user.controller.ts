import { Controller, Headers, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ResponseType } from 'src/interfaces/global.interface';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('User Management')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('/get-user-info')
  getUserInfo(
    @Headers('accessToken') accessToken: string,
  ): Promise<ResponseType> {
    return this.userService.getUserInfo(accessToken);
  }
}
