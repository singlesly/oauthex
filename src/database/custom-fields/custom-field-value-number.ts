import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { CustomField } from './custom-field';
import { Diary } from '../diary/diary';

@Entity('custom_field_values_number')
export class CustomFieldValueNumber {
  @ManyToOne(() => CustomField)
  public readonly field: CustomField;

  @PrimaryColumn('uuid')
  public readonly fieldId!: string;

  @ManyToOne(() => Diary)
  public readonly diary: Diary;

  @PrimaryColumn('uuid')
  public readonly diaryId!: string;

  @Column('numeric', {
    nullable: true,
  })
  public readonly value: number;

  constructor(field: CustomField, diary: Diary, value: number) {
    this.field = field;
    this.diary = diary;
    this.value = value;
  }
}
