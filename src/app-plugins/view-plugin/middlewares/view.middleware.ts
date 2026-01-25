import { Injectable, NestMiddleware } from '@nestjs/common';
import express from 'express';
import { VIEW_RESPONSE_RENDERING_KEY } from '@app/app-plugins/view-plugin/consts/view.consts';

@Injectable()
export class ViewMiddleware implements NestMiddleware {
  use(
    _: express.Request,
    res: express.Response,
    next: (error?: any) => void,
  ): void {
    const originalJson = res.json;
    res.json = function (body: unknown) {
      const rendering = VIEW_RESPONSE_RENDERING_KEY in res;
      if (rendering) {
        return res; // ничего не отправляем — уже отрендерено
      }

      return originalJson.call(this, body) as never;
    };

    next();
  }
}
