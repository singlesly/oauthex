import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CustomFieldValueDate } from './custom-field-value-date';
import { CustomFieldValueString } from './custom-field-value-string';
import { CustomFieldValueNumber } from './custom-field-value-number';
import { CustomFieldValueDictionary } from './custom-field-value-dictionary';

@Injectable()
export class CustomFieldValueRepository {
  constructor(private readonly dataSource: DataSource) {}

  public async save<
    T extends
      | CustomFieldValueDate
      | CustomFieldValueString
      | CustomFieldValueNumber
      | CustomFieldValueDictionary,
  >(entities: T[]): Promise<T[]> {
    return await Promise.all(
      entities.map((entity) => {
        return this.dataSource.getRepository(entity.constructor).save(entity);
      }),
    );
  }

  public async findAllValuesByDiaryId(id: string) {
    const where = {
      diary: {
        id,
      },
    };
    const relations = ['diary', 'field'];
    const result = await Promise.all([
      this.dataSource.getRepository(CustomFieldValueDate).find({
        where,
        relations,
      }),
      this.dataSource
        .getRepository(CustomFieldValueNumber)
        .find({ where, relations }),
      this.dataSource
        .getRepository(CustomFieldValueString)
        .find({ where, relations }),
      this.dataSource
        .getRepository(CustomFieldValueDictionary)
        .find({ where, relations: [...relations, 'value'] }),
    ]);

    return result.flat();
  }
}
