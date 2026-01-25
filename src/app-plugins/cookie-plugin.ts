import { INestApplication } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { AppPlugin } from '@app/app-plugins/app-plugin';

export class CookiePlugin implements AppPlugin {
  install(app: INestApplication): Promise<void> | void {
    app.use(cookieParser());
  }
}
