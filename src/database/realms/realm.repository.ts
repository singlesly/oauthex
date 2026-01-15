import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Realm } from './realm';

@Injectable()
export class RealmRepository {
  constructor(private readonly dataSource: DataSource) {}

  public async save(realm: Realm): Promise<void> {
    await this.dataSource.getRepository(Realm).save(realm);
  }

  public async findByNameOrFail(name: string): Promise<Realm> {
    return this.dataSource.getRepository(Realm).findOneByOrFail({
      name,
    });
  }
}
