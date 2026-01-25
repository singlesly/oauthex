import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';

export type ClientCredentials = { clientId: string; clientSecret: string };

export const ClientCredentialsHeader = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): ClientCredentials => {
    const rq = ctx.switchToHttp().getRequest<Request>();
    const headers = rq.headers;
    const authorization = headers['authorization'];
    if (!authorization) {
      throw new ForbiddenException(
        'Authorization header with client credentials not provided',
      );
    }
    const [type, credentials] = authorization.split(' ');
    if (type.toLowerCase() !== 'basic') {
      throw new ForbiddenException(
        'authorization header should be contains basic auth type',
      );
    }

    const [clientId, clientSecret = ''] = Buffer.from(credentials, 'base64')
      .toString('utf8')
      .split(':');

    return { clientId, clientSecret };
  },
);
