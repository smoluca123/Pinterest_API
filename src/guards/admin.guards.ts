import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const { accesstoken: accessToken } = request.headers;
      if (!accessToken) {
        throw new ForbiddenException('Access token is required');
      }
      await this.jwtService.verify(accessToken);
      const decoded = this.jwtService.decode(accessToken);
      const { id: user_id } = decoded;
      if (!user_id) {
        throw new ForbiddenException('Access token is missing user id');
      }

      const checkAuth = await this.prisma.users.findUnique({
        where: {
          user_id,
        },
        include: {
          type_user: true,
        },
      });
      //! Kiểm tra xem người dùng có role là 'admin' hay không
      if (checkAuth.type_user.isAdmin == 1) {
        return true;
      }
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    } catch (error) {
      throw new HttpException(error.message || 'Lỗi không xác định', 400);
    }
  }
}
