import { HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from '../../database/users/user.repository';
import { AuthenticateRequestDto } from '../requests/authenticate-request.dto';
import { OauthException } from '../exceptions/oauth.exception';
import { OauthActionEnum } from '../enum/oauth-action.enum';
import { AuthorizationCode } from '../../database/authorization-codes/authorization-code';
import { RealmRepository } from '../../database/realms/realm.repository';
import { ClientRepository } from '../../database/clients/client.repository';
import { Session } from '../../database/sessions/session';
import { AuthorizationCodeService } from './authorization-code.service';
import { EntityNotFoundError } from 'typeorm';
import { User } from '../../database/users/user';

@Injectable()
export class AuthenticateService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly realmRepository: RealmRepository,
    private readonly clientRepository: ClientRepository,
    private readonly authorizationCodeService: AuthorizationCodeService,
  ) {}

  public async authenticate(
    request: AuthenticateRequestDto,
    realmName: string,
    clientId: string,
    redirectUri: string,
  ): Promise<{ code: AuthorizationCode; session: Session }> {
    try {
      const [realm, client, user] = await Promise.all([
        this.realmRepository.findByNameOrFail(realmName),
        this.clientRepository.findByIdOrFail(clientId),
        this.userRepository.findByLoginOrFail(request.login, realmName),
      ]);

      if (request.password !== user.credentials.password) {
        throw new OauthException(
          realmName,
          OauthActionEnum.LOGIN,
          [{ name: 'password', errorMessage: 'Неверный пароль' }],
          'Неверный пароль',
        ).httpResponseCode(HttpStatus.BAD_REQUEST);
      }

      return this.authorizationCodeService.issue(
        realm,
        user,
        client,
        redirectUri,
      );
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        const fields: { name: string; errorMessage: string }[] = [];

        if (e.entityClass === User) {
          fields.push({ name: 'email', errorMessage: 'не найден' });
          fields.push({ name: 'login', errorMessage: 'не найден' });
        }

        throw new OauthException(
          realmName,
          OauthActionEnum.LOGIN,
          fields,
          'пользователь не найден',
        ).httpResponseCode(HttpStatus.NOT_FOUND);
      }

      throw e;
    }
  }
}
