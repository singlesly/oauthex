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

  public async run(port: number = 3000): Promise<void> {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
      logger: this.logger,
    });

    for (const plugin of this.appPlugins) {
      this.logger.log(
        `install plugin ${plugin.constructor.name}`,
        plugin.constructor.name,
      );
      await plugin.install(app);
    }

    await app.listen(port);

    this.logger.log(`application is running on ${port}`);
  }
}
