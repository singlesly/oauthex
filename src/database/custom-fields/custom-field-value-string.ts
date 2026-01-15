import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { CustomField } from './custom-field';
import { Diary } from '../diary/diary';

@Entity('custom_field_values_string')
export class CustomFieldValueString {
  @ManyToOne(() => CustomField)
  public readonly field: CustomField;

  @PrimaryColumn('uuid')
  public readonly fieldId!: string;

  @ManyToOne(() => Diary)
  public readonly diary: Diary;

  @PrimaryColumn('uuid')
  public readonly diaryId!: string;

  @Column('text', {
    nullable: true,
  })
  public readonly value: string;

  constructor(field: CustomField, diary: Diary, value: string) {
    this.field = field;
    this.diary = diary;
    this.value = value;
  }
}
