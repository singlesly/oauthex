import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Client } from './client';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ClientRepository {
  constructor(
    @InjectRepository(Client)
    private readonly repository: Repository<Client>,
  ) {}

  public async findByIdOrFail(id: string, realmName?: string): Promise<Client> {
    const query = this.repository
      .createQueryBuilder('client')
      .leftJoinAndSelect('client.realm', 'realm')
      .where('client.id = :id', { id });

    if (realmName !== undefined) {
      query.andWhere('realm.name = :realmName', { realmName });
    }

    return await query.getOneOrFail();
  }

  public async save(client: Client): Promise<void> {
    await this.repository.save(client);
  }
}
