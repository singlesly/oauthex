import { AppPlugin } from '@app/app-plugins/app-plugin';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

export class ValidationPlugin implements AppPlugin {
  install(app: NestExpressApplication): Promise<void> | void {
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );
  }
}
