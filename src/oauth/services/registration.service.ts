import { RegistrationRequestDto } from '../requests/registration-request.dto';
import { User } from '../../database/users/user';
import { HttpStatus, Injectable } from '@nestjs/common';
import { RealmRepository } from '../../database/realms/realm.repository';
import { Credentials } from '../../database/users/credentials';
import { Name } from '../../database/users/name';
import { Address } from '../../database/users/address';
import { UserRepository } from '../../database/users/user.repository';
import { OauthException } from '../exceptions/oauth.exception';
import { OauthActionEnum } from '../enum/oauth-action.enum';
import { Profile } from '../../database/users/profile';

@Injectable()
export class RegistrationService {
  constructor(
    private readonly realmRepository: RealmRepository,
    private readonly userRepository: UserRepository,
  ) {}

  public async registration(
    request: RegistrationRequestDto,
    realmName: string,
  ): Promise<User> {
    const realm = await this.realmRepository.findByNameOrFail(realmName);

    const exists = await this.userRepository.existsByLogin(request.login);
    if (exists) {
      throw new OauthException(
        realmName,
        OauthActionEnum.REGISTRATION,
        [{ name: 'login', errorMessage: 'пользователь уже существует' }],
        'пользователь уже существует',
      ).httpResponseCode(HttpStatus.CONFLICT);
    }

    const user = new User(
      realm,
      new Credentials(request.login, request.email, request.password),
      new Name(request.firstName, request.lastName, request.patronymic),
      new Address(request.city),
      new Profile(request.birthday),
    );

    await this.userRepository.save(user);

    return user;
  }
}
