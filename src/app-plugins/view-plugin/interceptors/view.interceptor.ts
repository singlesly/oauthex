import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import express from 'express';
import { VIEW_RESPONSE_RENDERING_KEY } from '@app/app-plugins/view-plugin/consts/view.consts';
import { ViewResponse } from '@app/app-plugins/view-plugin/responses/view.response';

@Injectable()
export class ViewInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const response = context.switchToHttp().getResponse<express.Response>();

    return next.handle().pipe(
      tap((result: unknown): void => {
        if (result instanceof ViewResponse) {
          Object.defineProperty(response, VIEW_RESPONSE_RENDERING_KEY, {
            value: true,
          });
          response.render(result.getView(), result.getOptions());
        }
      }),
    );
  }
}
