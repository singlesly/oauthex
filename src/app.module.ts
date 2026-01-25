import { Module } from '@nestjs/common';
import { OauthexModule } from '@app/oauthex/oauthex.module';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from '@app/config/app.config';
import { OauthexPagesModule } from '@app/oauthex-pages/oauthex-pages.module';

@Module({
  imports: [
    OauthexModule,
    OauthexPagesModule,
    ConfigModule.forRoot({
      load: [() => appConfig],
    }),
  ],
  controllers: [],
})
export class AppModule {}
