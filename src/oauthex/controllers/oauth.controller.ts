import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  NotImplementedException,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import express from 'express';
import {
  ApiBasicAuth,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthorizationCodeGrantRequestDto } from '../requests/authorization-code-grant-request.dto';
import { OauthCookieKeys } from '../enum/oauth-cookie-keys';
import { RegistrationRequestDto } from '../requests/registration-request.dto';
import { RegistrationService } from '../services/registration.service';
import { AuthenticateRequestDto } from '../requests/authenticate-request.dto';
import { AuthenticateService } from '../services/authenticate.service';
import { AuthorizationCodeService } from '../services/authorization-code.service';
import { AccessTokenRequestDto } from '../requests/access-token-request.dto';
import { AccessTokenResponseDto } from '../responses/access-token-response.dto';
import { AccessTokenService } from '../services/access-token.service';
import { FrontendUrlService } from '../services/frontend-url.service';
import { RegistrationResponse } from '../responses/registration.response';
import { ClientRepository } from '../../database/clients/client.repository';
import { ClientCredentialsHeader } from '../decorators/client-credentials';
import type { ClientCredentials } from '../decorators/client-credentials';
import { RecoveryPasswordResponse } from '../responses/recovery-password-response';
import { RecoveryPasswordRequestDto } from '../requests/recovery-password-request.dto';
import { RecoveryPasswordService } from '../services/recovery-password.service';
import { AuthorizeRequest } from '@app/oauthex/requests/authorize.request';
import { ProjectLoggerService } from '@app/logger/project-logger.service';
import { RedirectResponse } from '@app/common/responses/redirect.response';
import { RequestCookies } from '@app/common/decorators/request-cookies';
import { CookieStorage } from '@app/common/dto/cookie-storage';

@Controller('oauth')
@ApiTags('Oauth')
export class OauthController {
  constructor(
    private readonly registrationService: RegistrationService,
    private readonly authenticateService: AuthenticateService,
    private readonly authorizationCodeService: AuthorizationCodeService,
    private readonly accessTokenService: AccessTokenService,
    private readonly frontendUrlService: FrontendUrlService,
    private readonly clientRepository: ClientRepository,
    private readonly recoveryPasswordService: RecoveryPasswordService,
    private readonly logger: ProjectLoggerService,
  ) {}

  @Get('realms/:realm/authorize')
  @ApiOperation({
    summary: 'Проверить авторизацию пользователя',
    description:
      'Авторизационный endpoint: выдаёт authorization code после согласия пользователя',
  })
  @ApiParam({
    name: 'realm',
    description:
      'Неймспейс пользователей в рамках проекта всегда 1 значение main',
  })
  public async authorize(
    @Param('realm') realm: string,
    @Query() query: AuthorizeRequest,
    @RequestCookies() cookies: CookieStorage,
    @Req() request: express.Request,
  ): Promise<RedirectResponse> {
    this.logger.log('incoming query', query);

    const authSessionId = cookies.getOne(OauthCookieKeys.AUTH_SESSION);

    if (!authSessionId) {
      const url = new URL(
        `/oauth/realms/${realm}/login`,
        this.frontendUrlService.getFrontendUrl(request),
      );
      url.search = query.toQueryString();

      return new RedirectResponse(url);
    }

    const { code } = await this.authorizationCodeService.issueBySessionId(
      authSessionId,
      query.redirectUri.toString(),
    );

    const url = new URL(``, query.redirectUri);
    url.searchParams.set('code', code.code);

    return new RedirectResponse(url);
  }

  // @Post('realms/:realm/token')
  // @ApiOperation({
  //   summary: 'Получение токенов доступа',
  // })
  // @ApiOkResponse({
  //   type: AccessTokenResponseDto,
  // })
  // @HttpCode(HttpStatus.OK)
  // @ApiBasicAuth('optional-basic-auth')
  // @ApiHeader({
  //   name: 'authorization',
  //   required: false,
  //   description:
  //     'Basic Authorization для клиента. Принимает значение Basic base64(clientId:clientSecret). base64 функция которая кодирует clientId:clientSecret через : в base64',
  // })
  // @ApiParam({
  //   name: 'realm',
  //   description:
  //     'Неймспейс пользователей в рамках проекта всегда 1 значение main',
  // })
  // public async token(
  //   @Param('realm') realm: string,
  //   @Query() query: AccessTokenRequestDto,
  //   @ClientCredentialsHeader() clientCredentials: ClientCredentials,
  // ): Promise<AccessTokenResponseDto> {
  //   const { clientId } = clientCredentials;
  //
  //   return this.accessTokenService.issue(query, clientId);
  // }
  //
  // @Post('realms/:realm/introspect')
  // @ApiOperation({
  //   description:
  //     'Проверка валидности и метаданных токена (для Resource Server)',
  // })
  // public introspect(): void {
  //   throw new NotImplementedException();
  // }
  //
  // @Get('realms/:realm/jwks')
  // public getJwks(): void {
  //   throw new NotImplementedException();
  // }
  //
  // @Post('realms/:realm/device_authorization')
  // public deviceAuthorizaton(): void {
  //   throw new NotImplementedException();
  // }
  //
  // @Post('realms/:realm/revoke')
  // @ApiOperation({ summary: 'Удалить сессию авторизованного юзера' })
  // @ApiParam({
  //   name: 'realm',
  //   description:
  //     'Неймспейс пользователей в рамках проекта всегда 1 значение main',
  // })
  // @ApiConsumes('application/json')
  // public revoke(
  //   @Param('realm') realmName: string,
  //   @Headers('referer') referer: string,
  //   @Res({ passthrough: true }) response: express.Response,
  // ): void {
  //   response.cookie(OauthCookieKeys.AUTH_SESSION, null, {
  //     expires: new Date('2000-01-01'),
  //   });
  //
  //   const url = new URL('', referer);
  //
  //   return response.redirect(url.toString());
  // }
}
