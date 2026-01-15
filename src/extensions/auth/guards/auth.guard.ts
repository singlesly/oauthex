import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { AccessTokenPayload } from './token-payload';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../../../config/app.config';
import { OauthConfig } from '../../../config/oauth.config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService<AppConfig>,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    try {
      const request = context.switchToHttp().getRequest<Request>();

      const headers = request.headers;

      const authorization = headers.authorization;

      if (!authorization) {
        throw new UnauthorizedException(`Authorization header not provided`);
      }

      const [, token] = this.parseAuthHeader(authorization);

      const jwtSecret = this.config.getOrThrow<OauthConfig>('oauth').jwtSecret;
      const payload = this.jwtService.verify<AccessTokenPayload>(token, {
        secret: jwtSecret,
      });

      Reflect.set(request, 'accessToken', payload);

      return true;
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnauthorizedException('token expired');
      }

      throw e;
    }
  }

  parseAuthHeader(value: string): [string, string] {
    const parts = value.split(' ');

    if (parts.length != 2) {
      throw new UnauthorizedException('Invalid authorization header');
    }

    const [type, token] = parts;

    return [type, token];
  }
}
