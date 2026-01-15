import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Invite } from './invite';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class InviteRepository {
  constructor(
    @InjectRepository(Invite)
    private readonly repository: Repository<Invite>,
  ) {}

  public async findByIdOrFail(id: string): Promise<Invite> {
    return this.repository.findOneOrFail({
      where: {
        id,
      },
      relations: ['user', 'apiary'],
    });
  }

  public async save(invite: Invite): Promise<void> {
    await this.repository.save(invite);
  }

  public async remove(invite: Invite): Promise<void> {
    await this.repository.remove(invite);
  }
}
