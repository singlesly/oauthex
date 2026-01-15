import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AccessTokenPayload } from '../guards/token-payload';
import { Request } from 'express';

export const TokenPayload = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): AccessTokenPayload => {
    const request = ctx.switchToHttp().getRequest<Request>();

    const tokenPayload: AccessTokenPayload = Reflect.get(
      request,
      'accessToken',
    ) as AccessTokenPayload;

    if (!tokenPayload) {
      throw new UnauthorizedException(
        'Access token not provided for param request',
      );
    }

    return tokenPayload;
  },
);
