import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import express from 'express';
import { ViewResponse } from '@app/common/responses/view.response';
import { VIEW_RESPONSE_RENDERING_KEY } from '@app/common/consts/view.consts';

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
