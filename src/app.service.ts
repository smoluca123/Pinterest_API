import { Injectable } from '@nestjs/common';

type ApiInfo = {
  name: string;
  version: string;
  description: string;
  swagger: string;
  author: string[];
};

@Injectable()
export class AppService {
  getInfo(): ApiInfo {
    return {
      name: 'Pinterest',
      version: '1.0.0',
      description: 'Capstone Pinterest API',
      swagger: '/swagger',
      author: ['Luca Dev', 'Phương Tây'],
    };
  }
}
