import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ResponseType } from 'src/interfaces/global.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserInfoDto } from './dto/UpdateUser.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async getUserInfo(accessToken: string): Promise<ResponseType> {
    try {
      if (!accessToken) {
        throw new BadRequestException('Access token is required');
      }
      await this.jwtService.verify(accessToken);

      const decoded = await this.jwtService.decode(accessToken);
      const { id: user_id } = decoded;
      if (!user_id) {
        throw new BadRequestException('Access token is missing user id');
      }
      const userData = await this.prisma.users.findFirst({
        where: {
          user_id,
        },
      });

      //eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _pw, ...result } = userData;
      return {
        message: 'Success',
        data: result,
        statusCode: 200,
        date: new Date(),
      };
    } catch (error) {
      // if (error?.message) {
      //   throw new BadRequestException({ message: error.message, error });
      // }
      // throw error;
      throw new HttpException(error.message || 'Lỗi không xác định', 400, {});
    }
  }

  async updateUserInfo(
    accessToken: string,
    updateUserInfo: UpdateUserInfoDto,
  ): Promise<ResponseType> {
    try {
      if (!accessToken) {
        throw new BadRequestException('Access token is required');
      }
      await this.jwtService.verify(accessToken);
      const decoded = await this.jwtService.decode(accessToken);
      const { id: user_id } = decoded;
      if (!user_id) {
        throw new BadRequestException('Access token is missing user id');
      }
      const user = await this.prisma.users.findUnique({
        where: {
          user_id,
        },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      updateUserInfo.password = bcrypt.hashSync(updateUserInfo.password, 10);

      const { age, avatar, email, fullName, password } = updateUserInfo;

      const updatedUser = await this.prisma.users.update({
        data: {
          age: age || undefined,
          avatar: avatar || undefined,
          email: email || undefined,
          full_name: fullName || undefined,
          password: password || undefined,
        },
        where: {
          user_id,
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _pw, ...updatedUserResult } = updatedUser;
      return {
        message: 'Update user info success',
        data: updatedUserResult,
        statusCode: 200,
        date: new Date(),
      };
    } catch (error) {
      throw new HttpException(error.message || 'Lỗi không xác định', 400);
    }
  }
}
