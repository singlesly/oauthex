import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Response } from 'express';
import { RedirectResponse } from '@app/app-plugins/redirect-plugin/responses/redirect.response';

@Injectable()
export class RedirectInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<unknown> | Promise<Observable<unknown>> {
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((result: unknown): unknown => {
        if (result instanceof RedirectResponse) {
          return response.redirect(
            result.getStatusCode(),
            result.getRedirectUri(),
          );
        }

        return result;
      }),
    );
  }
}
