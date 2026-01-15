import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from '../../database/users/user.repository';
import { User } from '../../database/users/user';
import { Credentials } from '../../database/users/credentials';

@Injectable()
export class RecoveryPasswordService {
  constructor(private readonly userRepository: UserRepository) {}

  public async recovery(
    realm: string,
    login: string,
    password: string,
    code: string,
  ): Promise<User> {
    /**
     * TODO: verify sms
     */
    if (code !== '0000') {
      throw new BadRequestException('invalid code');
    }

    const user = await this.userRepository.findByLoginOrFail(login, realm);
    user.updateCredentials(
      new Credentials(user.credentials.login, user.credentials.email, password),
    );
    await this.userRepository.save(user);

    return user;
  }
}
