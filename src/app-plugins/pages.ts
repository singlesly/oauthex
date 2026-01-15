import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

export function usePages(app: NestExpressApplication) {
  app.setBaseViewsDir(join(process.cwd(), 'pages'));
  app.setViewEngine('hbs');
}
