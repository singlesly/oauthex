import { Global, Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { loggerOptions } from './logger.options';
import { ProjectLoggerService } from './project-logger.service';

@Global()
@Module({
  imports: [WinstonModule.forRoot(loggerOptions)],
  providers: [ProjectLoggerService],
  exports: [WinstonModule, ProjectLoggerService],
})
export class LoggerModule {}
