import { Injectable } from '@nestjs/common';
import { Session } from './session';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SessionRepository {
  constructor(
    @InjectRepository(Session)
    private readonly repository: Repository<Session>,
  ) {}

  public async findOneByIdOrFail(id: string): Promise<Session> {
    return await this.repository.findOneOrFail({
      where: {
        id,
      },
      relations: ['user.realm'],
    });
  }

  public async save(session: Session): Promise<void> {
    await this.repository.save(session);
  }
}
