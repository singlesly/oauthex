import * as dotenv from 'dotenv';
import { join } from 'path';
dotenv.config({ path: join(process.cwd(), '.env') });

import { AppModule } from './app.module';
import { useSwagger } from './app-plugins/swagger';
import { useCookie } from './app-plugins/cookie';
import { usePages } from './app-plugins/pages';
import { App } from './app';
import { WinstonModule } from 'nest-winston';
import { loggerOptions } from './logger/logger.options';

new App(AppModule, WinstonModule.createLogger(loggerOptions))
  .plugins([usePages, useSwagger, useCookie])
  .run();
