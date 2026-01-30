import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { OauthCookieKeys } from '../enum/oauth-cookie-keys';
import { AuthorizationCodeService } from '../services/authorization-code.service';
import { AuthorizeRequest } from '@app/oauthex/requests/authorize.request';
import { RequestCookies } from '@app/common/decorators/request-cookies';
import { CookieStorage } from '@app/common/dto/cookie-storage';
import { RedirectResponse } from '@app/app-plugins/redirect-plugin/responses/redirect.response';
import { ClientRepository } from '@app/database/clients/client.repository';

@Controller()
@ApiTags('OAuth 2.1')
export class OauthController {
  constructor(
    private readonly authorizationCodeService: AuthorizationCodeService,
    private readonly clientRepository: ClientRepository,
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
      const client = await this.clientRepository.findByIdOrFail(
        query.clientId,
        realm,
      );
      if (
        !client.settings.redirectUris.includes(query.redirectUri.toString())
      ) {
        throw new BadRequestException('unregistered redirect uri');
      }

      const url = new URL(``, client.settings.uiBaseUrl);
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

  @Post('realms/:realm/token')
  @ApiOperation({
    summary: 'Получение токенов доступа',
  })
  public async token(): Promise<void> {}

  @Post('realms/:realm/revoke')
  @ApiOperation({
    summary: 'отзыв токенов доступа',
  })
  public async revoke(): Promise<void> {}

  @Get('realms/:realm/userinfo')
  public async userinfo(): Promise<void> {}

  @Get('realms/:realm/.well-known/openid-configuration')
  public async wellKnownConfiguration(): Promise<void> {}

  @Get('realms/:realm/jwks.json')
  public async jwks(): Promise<void> {}
}
