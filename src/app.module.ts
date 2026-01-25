import { Module } from '@nestjs/common';
import { OauthexModule } from '@app/oauthex/oauthex.module';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from '@app/config/app.config';

@Module({
  imports: [
    OauthexModule,
    ConfigModule.forRoot({
      load: [() => appConfig],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
