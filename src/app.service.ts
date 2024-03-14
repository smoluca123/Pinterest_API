import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

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
  constructor(private readonly jwtService: JwtService) {}
  getInfo(): ApiInfo {
    return {
      token: this.jwtService.sign({}),
      name: 'Pinterest',
      version: '1.0.0',
      description: 'Capstone Pinterest API',
      swagger: '/swagger',
      author: ['Luca Dev', 'Phương Tây'],
    };
  }
}
