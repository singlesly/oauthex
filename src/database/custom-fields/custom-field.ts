import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { randomUUID } from 'node:crypto';
import { CustomFieldTypeEnum } from './custom-field-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { CustomFieldValueString } from './custom-field-value-string';
import { CustomFieldValueNumber } from './custom-field-value-number';
import { CustomFieldValueDate } from './custom-field-value-date';
import { CustomFieldValueDictionary } from './custom-field-value-dictionary';

export type CustomFieldTypes =
  | CustomFieldValueString
  | CustomFieldValueNumber
  | CustomFieldValueDate
  | CustomFieldValueDictionary;

@Entity('custom_fields')
export class CustomField {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  public readonly id: string = randomUUID();

  @Column('varchar')
  public readonly name: string;

  @Column('varchar')
  @ApiProperty({
    enum: CustomFieldTypeEnum,
  })
  public readonly type: CustomFieldTypeEnum;

  @Column('varchar', {
    nullable: true,
  })
  @ApiProperty()
  public readonly dictionaryType: string | null;

  constructor(
    id: string,
    name: string,
    type: CustomFieldTypeEnum,
    dictionaryType: string | null,
  ) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.dictionaryType = dictionaryType;
  }
}
