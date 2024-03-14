import { Injectable } from '@nestjs/common';
import { UserLoginDto } from './dto/UserLogin.dto';

@Injectable()
export class AuthService {
  login(userLoginDto: UserLoginDto) {
    console.log(userLoginDto);
    return 'login';
  }
}
