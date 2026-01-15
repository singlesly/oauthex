import { ConsoleLogger, LoggerService, Type } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppPlugin } from './app-plugins/app-plugin';

export class App {
  private readonly appPlugins: AppPlugin[] = [];
  constructor(
    private readonly module: Type<any>,
    private readonly logger: LoggerService = new ConsoleLogger(),
  ) {}

  public plugins(plugins: AppPlugin[]): App {
    this.appPlugins.push(...plugins);

    return this;
  }

  public run(): void {
    NestFactory.create<NestExpressApplication>(AppModule, {
      logger: this.logger,
    })
      .then(async (app) => {
        for (const plugin of this.appPlugins) {
          await plugin(app);
        }

        await app.listen(process.env.PORT ?? 3000);

        return app;
      })
      .then(() => {
        this.logger.log('application is running');
      });
  }
}
