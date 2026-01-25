import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import express from 'express';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { OauthCookieKeys } from '../enum/oauth-cookie-keys';
import { AuthorizationCodeService } from '../services/authorization-code.service';
import { FrontendUrlService } from '../services/frontend-url.service';
import { AuthorizeRequest } from '@app/oauthex/requests/authorize.request';
import { ProjectLoggerService } from '@app/logger/project-logger.service';
import { RequestCookies } from '@app/common/decorators/request-cookies';
import { CookieStorage } from '@app/common/dto/cookie-storage';
import { RedirectResponse } from '@app/app-plugins/redirect-plugin/responses/redirect.response';

@Controller('oauth')
@ApiTags('Oauth')
export class OauthController {
  constructor(
    private readonly authorizationCodeService: AuthorizationCodeService,
    private readonly frontendUrlService: FrontendUrlService,
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
  ): Promise<RedirectResponse> {
    const authSessionId = cookies.getOne(OauthCookieKeys.AUTH_SESSION);

    if (!authSessionId) {
      const url = new URL(
        `/oauthex/pages/realms/${realm}/login`,
        'http://localhost:3000',
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
