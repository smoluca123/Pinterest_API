import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from './prisma/prisma.service';

type ApiInfo = {
  authorizationToken?: string;
  name: string;
  version: string;
  description: string;
  swagger: string;
  author: string;
};

@Injectable()
export class AppService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}
  async getInfo(): Promise<ApiInfo> {
    const authCode = await this.prisma.auth_code.findFirst({});
    return {
      authorizationToken: this.jwtService.sign({
        codeId: authCode.code_id,
        code: authCode.code,
      }),
      name: 'Pinterest',
      version: '1.0.0',
      description: 'Capstone Pinterest API',
      swagger: '/swagger',
      author: 'Luca Dev',
    };
  }
}
