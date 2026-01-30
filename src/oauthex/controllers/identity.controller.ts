import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RegistrationRequest } from '@app/oauthex/requests/registration.request';
import { RegistrationService } from '@app/oauthex/services/registration.service';
import { AuthorizationCodeService } from '@app/oauthex/services/authorization-code.service';
import * as clientCredentials from '@app/oauthex/decorators/client-credentials';
import { ClientRepository } from '@app/database/clients/client.repository';
import { RegistrationResponse } from '@app/oauthex/responses/registration.response';
import { LoginRequest } from '@app/oauthex/requests/login.request';
import { LoginService } from '@app/oauthex/services/login.service';
import { RedirectUri } from '@app/oauthex/decorators/redirect-uri';
import { RealmName } from '@app/oauthex/decorators/realm-name';
import { AuthorizationCodeResponse } from '@app/oauthex/responses/authorization-code.response';

@Controller('realms/:realm')
@ApiTags('Identity')
export class IdentityController {
  constructor(
    private readonly registrationService: RegistrationService,
    private readonly authorizationCodeService: AuthorizationCodeService,
    private readonly clientRepository: ClientRepository,
    private readonly loginService: LoginService,
  ) {}

  @Post('registration')
  @ApiOperation({
    summary: 'Регистрация пользователя',
  })
  @ApiOkResponse({
    type: RegistrationResponse,
  })
  @ApiBasicAuth()
  public async registration(
    @Body() request: RegistrationRequest,
    @Param('realm') realm: string,
    @clientCredentials.ClientCredentialsHeader()
    credentials: clientCredentials.ClientCredentials,
  ): Promise<RegistrationResponse> {
    const client = await this.clientRepository.findByIdOrFail(
      credentials.clientId,
      realm,
    );
    const user = await this.registrationService.registration(request, realm);

    const { code } = await this.authorizationCodeService.issue(
      user.realm,
      user,
      client,
      '',
    );

    return {
      code: code.code,
    };
  }

  @Post('login')
  @ApiOkResponse()
  @ApiBasicAuth('optional-basic-auth')
  public async login(
    @Body() request: LoginRequest,
    @RealmName() realmName: string,
    @RedirectUri() redirectUri: string,
    @clientCredentials.ClientCredentialsHeader()
    credentials: clientCredentials.ClientCredentials,
  ): Promise<AuthorizationCodeResponse> {
    const { code } = await this.loginService.login(
      request,
      realmName,
      credentials.clientId,
      redirectUri,
    );

    return new AuthorizationCodeResponse(code.code);
  }

  @Post('forgot')
  public async forgot(): Promise<void> {}

  @Post('reset/:token')
  public async reset(): Promise<void> {}

  @Post('confirm/:token')
  public async confirm(): Promise<void> {}

  @Get('logout')
  public async logout(): Promise<void> {}
}
