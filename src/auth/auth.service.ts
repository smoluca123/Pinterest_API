import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserLoginDto } from './dto/UserLogin.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon2 from 'argon2';
import { ResponseType } from 'src/interfaces/global.interface';
import { JwtService } from '@nestjs/jwt';
import { UserRegisterDto } from './dto/UserRegister.dto';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async login(userLoginDto: UserLoginDto): Promise<ResponseType> {
    try {
      const { email, password } = userLoginDto;
      const checkUser = await this.prisma.users.findFirst({
        where: { email },
      });

      if (!checkUser) {
        throw new NotFoundException('User not found');
      }

      if (!(await argon2.verify(checkUser.password, password))) {
        throw new UnauthorizedException('Wrong password');
      }
      const token = this.jwtService.sign({ id: checkUser.user_id });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _pw, ...result } = checkUser;
      return {
        message: 'Login Success',
        data: { ...result, accessToken: token },
        statusCode: 200,
        date: new Date(),
      };
    } catch (error) {
      throw new HttpException(error.message || 'Lỗi không xác định', 400, {});
      // if (error?.message) {
      //   throw new BadRequestException({ message: error.message, error });
      // }
      // throw error;
    }
  }

  async register(userRegisterDto: UserRegisterDto): Promise<ResponseType> {
    try {
      const { email, password, age, fullName, avatar } = userRegisterDto;
      const checkUser = await this.prisma.users.findFirst({
        where: { email },
      });
      if (checkUser) {
        throw new ConflictException('Email already exists');
      }
      const hashedPassword = await argon2.hash(password);
      const user = await this.prisma.users.create({
        data: {
          email,
          password: hashedPassword,
          full_name: fullName,
          age,
          avatar,
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _pw, ...result } = user;
      const accessToken = this.jwtService.sign({
        id: result.user_id,
      });

      return {
        message: 'Register Success',
        data: { ...result, accessToken },
        statusCode: 200,
        date: new Date(),
      };
    } catch (error) {
      throw new HttpException(error.message || 'Lỗi không xác định', 400, {});
    }
  }
}
