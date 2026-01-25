import {
  ClassSerializerInterceptor,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { OauthexModule } from '@app/oauthex/oauthex.module';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from '@app/config/app.config';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { RedirectInterceptor } from '@app/common/interceptors/redirect.interceptor';

@Module({
  imports: [
    OauthexModule,
    ConfigModule.forRoot({
      load: [() => appConfig],
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
      }),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RedirectInterceptor,
    }
  ],
})
export class AppModule {}
