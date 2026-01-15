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

  public async findByIdOrFail(id: string): Promise<Client> {
    return await this.repository.findOneOrFail({
      where: {
        id,
      },
      relations: ['realm'],
    });
  }

  public async save(client: Client): Promise<void> {
    await this.repository.save(client);
  }
}
