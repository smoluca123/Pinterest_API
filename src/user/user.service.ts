import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ResponseType } from 'src/interfaces/global.interface';
import { PrismaService } from 'src/prisma/prisma.service';

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
}
