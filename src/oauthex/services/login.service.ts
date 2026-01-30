import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthenticateRequestDto } from '@app/oauthex/requests/authenticate-request.dto';
import { AuthorizationCode } from '@app/database/authorization-codes/authorization-code';
import { Session } from '@app/database/sessions/session';
import { OauthException } from '@app/oauthex/exceptions/oauth.exception';
import { OauthActionEnum } from '@app/oauthex/enum/oauth-action.enum';
import { EntityNotFoundError } from 'typeorm';
import { User } from '@app/database/users/user';
import { RealmRepository } from '@app/database/realms/realm.repository';
import { ClientRepository } from '@app/database/clients/client.repository';
import { UserRepository } from '@app/database/users/user.repository';
import { AuthorizationCodeService } from '@app/oauthex/services/authorization-code.service';
import { LoginRequest } from '@app/oauthex/requests/login.request';

@Injectable()
export class LoginService {
  constructor(
    private readonly realmRepository: RealmRepository,
    private readonly clientRepository: ClientRepository,
    private readonly userRepository: UserRepository,
    private readonly authorizationCodeService: AuthorizationCodeService,
  ) {}

  public async login(
    request: LoginRequest,
    realmName: string,
    clientId: string,
    redirectUri: string,
  ): Promise<{ code: AuthorizationCode; session: Session }> {
    const [realm, client, user] = await Promise.all([
      this.realmRepository.findByNameOrFail(realmName),
      this.clientRepository.findByIdOrFail(clientId),
      this.userRepository.findByLoginOrFail(request.login, realmName),
    ]);

    if (request.password !== user.credentials.password) {
      throw new ForbiddenException('invalid password');
    }

    return this.authorizationCodeService.issue(
      realm,
      user,
      client,
      redirectUri,
    );
  }
}
