import {
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { CustomField } from './custom-field';
import { Diary } from '../diary/diary';
import { Dictionary } from '../dictionary/dictionary';

@Entity('custom_field_values_dictionary')
export class CustomFieldValueDictionary {
  @ManyToOne(() => CustomField)
  public readonly field: CustomField;

  @PrimaryColumn('uuid')
  public readonly fieldId!: string;

  @ManyToOne(() => Diary)
  public readonly diary: Diary;

  @PrimaryColumn('uuid')
  public readonly diaryId!: string;

  @ManyToMany(() => Dictionary)
  @JoinTable({
    name: 'custom_field_values_dictionaries_references',
  })
  public readonly value: Dictionary[];

  constructor(field: CustomField, diary: Diary, value: Dictionary[]) {
    this.field = field;
    this.diary = diary;
    this.value = value;
  }
}
