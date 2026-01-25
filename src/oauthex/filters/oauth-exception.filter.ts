import { BaseExceptionFilter } from '@nestjs/core';
import { ArgumentsHost, Catch } from '@nestjs/common';
import { OauthException } from '../exceptions/oauth.exception';
import { Request, Response } from 'express';
import { OauthActionEnum } from '../enum/oauth-action.enum';
import { FrontendUrlService } from '../services/frontend-url.service';

@Catch(OauthException)
export class OauthExceptionFilter extends BaseExceptionFilter {
  constructor(private readonly frontendUrlService: FrontendUrlService) {
    super();
  }

  catch(exception: OauthException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const oauthFrontendUrl = this.frontendUrlService.getFrontendUrl(request);

    const jsonResponse =
      request.headers['content-type']?.includes('application/json');

    const redirectUrl = new URL(
      this.actionToRedirectPath(exception),
      oauthFrontendUrl.toString(),
    );
    redirectUrl.searchParams.set(
      'errors',
      exception.fields
        .map((field) => `${field.name}:${field.errorMessage}`)
        .join(','),
    );

    if (jsonResponse) {
      response.status(exception.httpCode);
      response.send(exception.asJsonResponse());
    } else {
      response.redirect(redirectUrl.toString());
    }
  }

  private actionToRedirectPath(exception: OauthException): string {
    if (exception.action === OauthActionEnum.REGISTRATION) {
      return `/oauth/realms/${exception.realm}/registration`;
    } else if (exception.action === OauthActionEnum.LOGIN) {
      return `/oauth/realms/${exception.realm}/login`;
    }
    throw new Error('invalid action');
  }
}
