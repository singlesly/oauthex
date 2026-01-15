import { NestExpressApplication } from '@nestjs/platform-express';

export type AppPlugin = (app: NestExpressApplication) => void | Promise<void>;
