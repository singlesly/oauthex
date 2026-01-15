import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AccessTokenPayload } from '../../extensions/auth/guards/token-payload';

export const UserId = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    const payload = request.accessToken as AccessTokenPayload;

    if (!payload || !payload.sub) {
      throw new Error('Access token payload not found or missing sub field');
    }

    return payload.sub;
  },
);
