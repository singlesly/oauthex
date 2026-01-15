import { Injectable } from '@nestjs/common';
import { OauthConfig } from '../../config/oauth.config';
import { Request } from 'express';

/**
 * Так как фронтенд разрабатывается локально, а бекенд на стенде, то нужно сделать редиректы на локальный фронтенд.
 * Так как конфигурация фронтенда передается через env
 * Данный сервис может посмотреть реквест и из реквеста достать фронтенд урл по которому будет редирект, чтобы не переопределять конфигурацию.
 * Данный функционал выключен в продакшене, и включен только на ДЕВ стенде.
 */
@Injectable()
export class FrontendUrlService {
  constructor(private readonly oauthConfig: OauthConfig) {}

  public getFrontendUrl(request: Request): URL {
    const query = request.query;
    if (query.frontend_url && typeof query.frontend_url === 'string') {
      return new URL('', query.frontend_url);
    }

    return this.oauthConfig.frontendUrl;
  }
}
