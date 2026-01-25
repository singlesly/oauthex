import * as dotenv from 'dotenv';
import { join } from 'path';
dotenv.config({ path: join(process.cwd(), '.env') });

import { AppModule } from './app.module';
import { SwaggerPlugin } from './app-plugins/swagger';
import { CookiePlugin } from './app-plugins/cookie-plugin';
import { PagesPlugin } from './app-plugins/pages';
import { App } from './app';
import { WinstonModule } from 'nest-winston';
import { loggerOptions } from './logger/logger.options';

new App(AppModule, WinstonModule.createLogger(loggerOptions))
  .plugins([new PagesPlugin(), new SwaggerPlugin(), new CookiePlugin()])
  .run();
