import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'BEM-VINDO À COMPASS CAR';
  }
}
