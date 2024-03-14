import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UserLoginDto } from './dto/UserLogin.dto';

@ApiTags('Auth')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @ApiBody({ type: UserLoginDto })
  login(@Body() userLoginDto: UserLoginDto) {
    return this.authService.login(userLoginDto);
  }
}
