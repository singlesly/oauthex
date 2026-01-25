import { AppPlugin } from '@app/app-plugins/app-plugin';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export class ValidationPlugin implements AppPlugin {
  install(app: NestExpressApplication): Promise<void> | void {
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector)),
    );
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );
  }
}
