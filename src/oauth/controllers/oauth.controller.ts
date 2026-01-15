import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  RawBodyRequest,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';
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
import { FormdataInterceptor } from 'nestjs-formdata-interceptor';
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
import {
  ClientCredentials,
  ClientCredentialsHeader,
} from '../decorators/client-credentials';
import { RecoveryPasswordResponse } from '../responses/recovery-password-response';
import { RecoveryPasswordRequestDto } from '../requests/recovery-password-request.dto';
import { RecoveryPasswordService } from '../services/recovery-password.service';

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
  ) {}

  @Get('realms/:realm/authorize')
  @ApiOperation({
    summary: 'Проверить авторизацию пользователя',
    description:
      'Если пользователь авторизован, то произойдет редирект на redirect_uri в ином случае откроется страница {frontendUrl}/oauth/realms/{realm}/login',
  })
  @ApiParam({
    name: 'realm',
    description:
      'Неймспейс пользователей в рамках проекта всегда 1 значение main',
  })
  public async authorize(
    @Param('realm') realm: string,
    @Query() query: AuthorizationCodeGrantRequestDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const authSessionId = request.cookies[OauthCookieKeys.AUTH_SESSION] as
      | string
      | undefined;

    if (!authSessionId) {
      const url = new URL(
        `/oauth/realms/${realm}/login`,
        this.frontendUrlService.getFrontendUrl(request),
      );
      url.search = query.toQueryString();
      return response.redirect(url.toString());
    }

    const { code } = await this.authorizationCodeService.issueBySessionId(
      authSessionId,
      query.redirect_uri || '',
    );

    const url = new URL(``, query.redirect_uri as string);
    url.searchParams.set('code', code.code);

    return response.redirect(url.toString());
  }

  @Post('realms/:realm/token')
  @ApiOperation({
    summary: 'Получение токенов доступа',
  })
  @ApiOkResponse({
    type: AccessTokenResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @ApiBasicAuth('optional-basic-auth')
  @ApiHeader({
    name: 'authorization',
    required: false,
    description:
      'Basic Authorization для клиента. Принимает значение Basic base64(clientId:clientSecret). base64 функция которая кодирует clientId:clientSecret через : в base64',
  })
  @ApiParam({
    name: 'realm',
    description:
      'Неймспейс пользователей в рамках проекта всегда 1 значение main',
  })
  public async token(
    @Param('realm') realm: string,
    @Query() query: AccessTokenRequestDto,
    @ClientCredentialsHeader() clientCredentials: ClientCredentials,
  ): Promise<AccessTokenResponseDto> {
    const { clientId } = clientCredentials;

    return this.accessTokenService.issue(query, clientId);
  }

  @Post(`realms/:realm/authenticate`)
  @ApiOperation({
    summary: 'Авторизует пользователя по кредам и создает сессию',
    description:
      'В случае успешной авторизации будет перенаправление на redirect_uri с подставленным code в query строку, code клиент меняет на token',
  })
  @ApiParam({
    name: 'realm',
    description:
      'Неймспейс пользователей в рамках проекта всегда 1 значение main',
  })
  @UseInterceptors(new FormdataInterceptor())
  @ApiConsumes('multipart/form-data')
  public async authenticate(
    @Param('realm') realm: string,
    @Body() body: AuthenticateRequestDto,
    @Query() query: AuthorizationCodeGrantRequestDto,
    @Res() response: Response,
  ): Promise<void> {
    const { code, session } = await this.authenticateService.authenticate(
      body,
      realm,
      query.client_id,
      query.redirect_uri || '',
    );

    const url = new URL('', code.redirectUri);
    url.searchParams.set('code', code.code);
    response.cookie(OauthCookieKeys.AUTH_SESSION, session.id, {
      expires: new Date('2030-01-01'),
    });

    return response.redirect(url.toString());
  }

  @Post('realms/:realm/registration')
  @ApiOperation({ summary: 'Регистрация нового пользователя в системе' })
  @ApiParam({
    name: 'realm',
    description:
      'Неймспейс пользователей в рамках проекта всегда 1 значение main',
  })
  @ApiHeader({
    name: 'authorization',
    required: false,
    description:
      'Basic Authorization для клиента. Принимает значение Basic base64(clientId:clientSecret). base64 функция которая кодирует clientId:clientSecret через : в base64',
  })
  @ApiConsumes('application/json')
  @ApiBasicAuth('optional-basic-auth')
  @ApiHeader({
    name: 'authorization',
    required: false,
  })
  @ApiConflictResponse({
    description: 'если юзер уже существует и логин/email занят',
  })
  @ApiCreatedResponse({
    description: 'успешная регистрация вернется code который меняется на токен',
  })
  public async registration(
    @Param('realm') realmName: string,
    @Body() body: RegistrationRequestDto,
    @Res({ passthrough: true }) response: Response,
    @ClientCredentialsHeader() clientCredentials: ClientCredentials,
  ): Promise<RegistrationResponse> {
    const { clientId } = clientCredentials;
    const client = await this.clientRepository.findByIdOrFail(clientId);
    const user = await this.registrationService.registration(body, realmName);
    const { code, session } = await this.authorizationCodeService.issue(
      user.realm,
      user,
      client,
      '',
    );

    response.cookie(OauthCookieKeys.AUTH_SESSION, session.id, {
      expires: new Date('2030-01-01'),
    });

    return { code: code.code };
  }

  @Post('realms/:realm/logout')
  @ApiOperation({ summary: 'Удалить сессию авторизованного юзера' })
  @ApiParam({
    name: 'realm',
    description:
      'Неймспейс пользователей в рамках проекта всегда 1 значение main',
  })
  @ApiConsumes('application/json')
  public logout(
    @Param('realm') realmName: string,
    @Headers('referer') referer: string,
    @Res({ passthrough: true }) response: Response,
  ): void {
    response.cookie(OauthCookieKeys.AUTH_SESSION, null, {
      expires: new Date('2000-01-01'),
    });

    const url = new URL('', referer);

    return response.redirect(url.toString());
  }

  @Post('realms/:realm/recovery-password')
  @ApiOperation({ summary: 'Восстановление пароля' })
  @ApiBasicAuth('optional-basic-auth')
  @ApiConsumes('application/json')
  @ApiParam({
    name: 'realm',
    description:
      'Неймспейс пользователей в рамках проекта всегда 1 значение main',
  })
  @ApiHeader({
    name: 'authorization',
    required: false,
    description:
      'Basic Authorization для клиента. Принимает значение Basic base64(clientId:clientSecret). base64 функция которая кодирует clientId:clientSecret через : в base64',
  })
  @ApiCreatedResponse({
    type: RecoveryPasswordResponse,
  })
  public async recoveryPassword(
    @Body() dto: RecoveryPasswordRequestDto,
    @ClientCredentialsHeader() clientCredentials: ClientCredentials,
    @Param('realm') realmName: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<RecoveryPasswordResponse> {
    const client = await this.clientRepository.findByIdOrFail(
      clientCredentials.clientId,
    );
    const user = await this.recoveryPasswordService.recovery(
      realmName,
      dto.login,
      dto.password,
      dto.code,
    );

    const { code, session } = await this.authorizationCodeService.issue(
      user.realm,
      user,
      client,
      '',
    );

    response.cookie(OauthCookieKeys.AUTH_SESSION, session.id, {
      expires: new Date('2030-01-01'),
    });

    return { code: code.code };
  }
}
