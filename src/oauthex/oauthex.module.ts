import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { OauthController } from './controllers/oauth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Realm } from '../database/realms/realm';
import { Client } from '../database/clients/client';
import { RealmRepository } from '../database/realms/realm.repository';
import { RegistrationService } from './services/registration.service';
import { APP_FILTER } from '@nestjs/core';
import { OauthExceptionFilter } from './filters/oauth-exception.filter';
import { ClientRepository } from '../database/clients/client.repository';
import { JwtModule } from '@nestjs/jwt';
import { OauthConfig } from '../config/oauth.config';
import { AuthenticateService } from './services/authenticate.service';
import { AuthorizationCodeService } from './services/authorization-code.service';
import { AccessTokenService } from './services/access-token.service';
import { FrontendUrlService } from './services/frontend-url.service';
import { DatabaseModule } from '../database/database.module';
import { RecoveryPasswordService } from './services/recovery-password.service';
import { LoggerModule } from '@app/logger/logger.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    LoggerModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.getOrThrow<OauthConfig>('oauth').jwtSecret,
          global: true,
        };
      },
    }),
  ],
  controllers: [OauthController],
  providers: [
    AuthorizationCodeService,
    AuthenticateService,
    AccessTokenService,
    FrontendUrlService,
    RegistrationService,
    RecoveryPasswordService,
    {
      provide: OauthConfig,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        config.getOrThrow<OauthConfig>('oauth'),
    },
    {
      provide: APP_FILTER,
      useClass: OauthExceptionFilter,
    },
  ],
})
export class OauthexModule {}
