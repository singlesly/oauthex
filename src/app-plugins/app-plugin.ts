import { NestExpressApplication } from '@nestjs/platform-express';

export interface AppPlugin {
  install(app: NestExpressApplication): Promise<void> | void;
}
