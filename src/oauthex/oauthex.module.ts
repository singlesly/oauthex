import { Module } from '@nestjs/common';
import { OauthController } from './controllers/oauth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RegistrationService } from './services/registration.service';
import { JwtModule } from '@nestjs/jwt';
import { OauthConfig } from '../config/oauth.config';
import { AuthenticateService } from './services/authenticate.service';
import { AuthorizationCodeService } from './services/authorization-code.service';
import { AccessTokenService } from './services/access-token.service';
import { FrontendUrlService } from './services/frontend-url.service';
import { DatabaseModule } from '../database/database.module';
import { RecoveryPasswordService } from './services/recovery-password.service';
import { LoggerModule } from '@app/logger/logger.module';
import { IdentityController } from '@app/oauthex/controllers/identity.controller';
import { LoginService } from '@app/oauthex/services/login.service';

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
  controllers: [OauthController, IdentityController],
  providers: [
    AuthorizationCodeService,
    AuthenticateService,
    AccessTokenService,
    FrontendUrlService,
    RegistrationService,
    RecoveryPasswordService,
    LoginService,
    {
      provide: OauthConfig,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        config.getOrThrow<OauthConfig>('oauth'),
    },
  ],
})
export class OauthexModule {}
