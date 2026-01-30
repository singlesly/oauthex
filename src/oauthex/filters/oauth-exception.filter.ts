import { BaseExceptionFilter } from '@nestjs/core';
import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { OauthException } from '../exceptions/oauth.exception';
import { Response } from 'express';
import { FrontendUrlService } from '../services/frontend-url.service';

@Catch(OauthException)
export class OauthExceptionFilter extends BaseExceptionFilter {
  constructor(private readonly frontendUrlService: FrontendUrlService) {
    super();
  }

  catch(exception: OauthException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(HttpStatus.BAD_REQUEST);
    response.send(exception.asJsonResponse());
  }
}
