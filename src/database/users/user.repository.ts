import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { PaginationDto } from '../../common/dto/pagination.dto';

export interface FindUsersOptions {
  phone?: string;
  email?: string;
}

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  public async findByIdOrFail(id: string): Promise<User> {
    return this.repository.findOneOrFail({
      where: {
        id,
      },
      relations: ['realm', 'profile.avatar'],
    });
  }

  public async findFiltered(
    options: FindUsersOptions,
    page: PaginationDto,
  ): Promise<[User[], number]> {
    let findOptions = {
      ...page.getTakeSkip(),
    } as FindManyOptions<User>;

    if (options.phone) {
      findOptions = {
        ...findOptions,
        where: {
          credentials: {
            login: options.phone,
          },
        },
      };
    }

    if (options.email) {
      findOptions = {
        ...findOptions,
        where: {
          credentials: {
            email: options.email,
          },
        },
      };
    }

    return this.repository.findAndCount(findOptions);
  }

  public async existsByLogin(login: string): Promise<boolean> {
    return this.repository.existsBy({
      credentials: {
        login,
      },
    });
  }

  public async findByLoginOrFail(
    login: string,
    realmName: string,
  ): Promise<User> {
    return this.repository.findOneByOrFail([
      {
        credentials: {
          login,
        },
        realm: {
          name: realmName,
        },
      },
      {
        credentials: { email: login },
        realm: { name: realmName },
      },
    ]);
  }

  public async save(user: User): Promise<void> {
    await this.repository.save(user);
  }

  async softRemove(user: User) {
    await this.repository.softRemove(user);
  }
}
