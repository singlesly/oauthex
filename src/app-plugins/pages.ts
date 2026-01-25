import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppPlugin } from '@app/app-plugins/app-plugin';

export class PagesPlugin implements AppPlugin {
  install(app: NestExpressApplication): Promise<void> | void {
    app.setBaseViewsDir(join(process.cwd(), 'pages'));
    app.setViewEngine('hbs');
  }
}