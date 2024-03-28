import {
  Body,
  Controller,
  Headers,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ResponseType } from 'src/interfaces/global.interface';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserInfoDto } from './dto/UpdateUser.dto';

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

  @ApiBody({
    type: UpdateUserInfoDto,
    description:
      'For fields that you do not want to update, leave them blank. Exp : {email: "", password: "", fullName: "", age: "", avatar: ""}',
  })
  @Put('/update-user-info')
  updateUserInfo(
    @Headers('accessToken')
    accessToken: string,
    @Body() updateUserInfo: UpdateUserInfoDto,
  ): Promise<ResponseType> {
    return this.userService.updateUserInfo(accessToken, updateUserInfo);
  }
}
