import { AppPlugin } from '@app/app-plugins/app-plugin';
import { NestExpressApplication } from '@nestjs/platform-express';
import { TypeormExceptionFilter } from '@app/app-plugins/typeorm-plugin/filters/typeorm-exception.filter';

export class TypeormPlugin implements AppPlugin {
  install(app: NestExpressApplication): Promise<void> | void {
    app.useGlobalFilters(new TypeormExceptionFilter());
  }
}
