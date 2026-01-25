import * as dotenv from 'dotenv';
import { join } from 'path';
dotenv.config({ path: join(process.cwd(), '.env') });

import { AppModule } from './app.module';
import { SwaggerPlugin } from './app-plugins/swagger';
import { CookiePlugin } from './app-plugins/cookie-plugin';
import { App } from './app';
import { WinstonModule } from 'nest-winston';
import { loggerOptions } from './logger/logger.options';
import { ViewPlugin } from '@app/app-plugins/view-plugin/view-plugin';
import { RedirectPlugin } from '@app/app-plugins/redirect-plugin/redirect-plugin';
import { ValidationPlugin } from '@app/app-plugins/validation-plugin/validation-plugin';
import { TypeormPlugin } from '@app/app-plugins/typeorm-plugin/typeorm-plugin';

void new App(AppModule, WinstonModule.createLogger(loggerOptions))
  .plugins([
    new TypeormPlugin(),
    new RedirectPlugin(),
    new ValidationPlugin(),
    new ViewPlugin('pages', 'hbs', 'pages/oauthex'),
    new SwaggerPlugin('oauthex'),
    new CookiePlugin(),
  ])
  .run();
