import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from './prisma/prisma.service';

type ApiInfo = {
  token?: string;
  name: string;
  version: string;
  description: string;
  swagger: string;
  author: string[];
};

@Injectable()
export class AppService {
  constructor(
    private readonly jwtService: JwtService,
    private prisma: PrismaService,
  ) {}
  async getInfo(): Promise<ApiInfo> {
    const authCode = await this.prisma.auth_code.findFirst({});
    return {
      token: this.jwtService.sign({ code: authCode.code }),
      name: 'Pinterest',
      version: '1.0.0',
      description: 'Capstone Pinterest API',
      swagger: '/swagger',
      author: ['Luca Dev', 'Phương Tây'],
    };
  }
}
