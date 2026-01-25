import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import express from 'express';
import { CookieStorage } from '@app/common/dto/cookie-storage';

export const RequestCookies = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<express.Request>();

    return new CookieStorage(request);
  },
);
