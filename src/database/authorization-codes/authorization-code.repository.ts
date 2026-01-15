import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AuthorizationCode } from './authorization-code';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthorizationCodeRepository {
  constructor(
    @InjectRepository(AuthorizationCode)
    private readonly repository: Repository<AuthorizationCode>,
  ) {}

  public async findOrFail(code: string): Promise<AuthorizationCode> {
    return await this.repository.findOneOrFail({
      where: {
        code,
      },
      relations: ['user'],
    });
  }

  public async save(authorizationCode: AuthorizationCode): Promise<void> {
    await this.repository.save(authorizationCode);
  }
}
