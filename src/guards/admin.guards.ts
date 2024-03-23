import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
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
    const request = context.switchToHttp().getRequest();
    const { accesstoken: accessToken } = request.headers;

    const decoded = this.jwtService.decode(accessToken);
    const { id: user_id } = decoded;

    const checkAuth = await this.prisma.users.findUnique({
      where: {
        user_id,
      },
      include: {
        type_user: true,
      },
    });
    // // Kiểm tra xem người dùng có role là 'admin' hay không
    if (checkAuth.type_user.isAdmin == 1) {
      return true;
    }
    throw new ForbiddenException(
      'You do not have permission to access this resource',
    );
  }
}
