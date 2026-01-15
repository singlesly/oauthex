import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthGuard } from './guards/auth.guard';
import { OauthConfig } from '../../config/oauth.config';

@Module({
  imports: [ConfigModule, JwtModule],
  providers: [AuthGuard],
  exports: [AuthGuard],
})
export class AuthModule {}
