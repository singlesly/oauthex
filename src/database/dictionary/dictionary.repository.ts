import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Dictionary } from './dictionary';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { DictionaryTypeEnum } from './dictionary-type.enum';

@Injectable()
export class DictionaryRepository {
  constructor(
    @InjectRepository(Dictionary)
    private readonly repository: Repository<Dictionary>,
  ) {}

  public async save(entity: Dictionary): Promise<void> {
    await this.repository.save(entity);
  }

  public async findByIdOrFail(id: string): Promise<Dictionary> {
    return this.repository.findOneOrFail({
      where: {
        id,
      },
      relations: {
        apiary: true,
      },
    });
  }

  public async findFiltered(apiaryId?: string): Promise<Dictionary[]> {
    let options = {
      relations: ['apiary'],
    } as FindManyOptions<Dictionary>;

    if (apiaryId) {
      options = {
        ...options,
        where: {
          apiary: {
            id: apiaryId,
          },
        },
      };
    }

    return this.repository.find(options);
  }

  public async softRemoveById(id: string) {
    const entity = await this.repository.findOneOrFail({
      where: {
        id,
      },
    });

    await this.repository.softRemove(entity);
  }

  async findByIds(dictionaryIds: string[]): Promise<Dictionary[]> {
    if (dictionaryIds.length === 0) {
      return [];
    }

    return this.repository.find({
      where: {
        id: In(dictionaryIds),
      },
    });
  }

  async renameTypeForAll(param: {
    current: DictionaryTypeEnum | string;
    new: string;
  }) {
    await this.repository
      .createQueryBuilder()
      .update(Dictionary)
      .set({ type: param.new })
      .where('type = :current', { current: param.current })
      .execute();
  }
}
