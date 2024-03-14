import { Injectable, NestMiddleware } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class UserIdCheckMiddleware implements NestMiddleware {
    constructor(private readonly prisma : PrismaClient)
  use(req: Request, res: Response, next: NextFunction) {
    const {authCode} = req.user; // Giả sử userId được lưu trong req.user.userId
    // const checkAuthCode = this.prisma
    if (!checkAuthCode) {
      // Nếu userId không phải là 5, trả về lỗi 403 Forbidden
      return res.status(403).json({ message: 'Forbidden' });
    }
    // Nếu userId là 5, tiếp tục thực hiện xác thực Authorization
    next();
  }
}
