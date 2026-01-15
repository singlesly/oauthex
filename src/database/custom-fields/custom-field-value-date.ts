import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { CustomField } from './custom-field';
import { Diary } from '../diary/diary';

@Entity('custom_field_values_date')
export class CustomFieldValueDate {
  @ManyToOne(() => CustomField)
  public readonly field: CustomField;

  @PrimaryColumn('uuid')
  public readonly fieldId!: string;

  @ManyToOne(() => Diary)
  public readonly diary: Diary;

  @PrimaryColumn('uuid')
  public readonly diaryId!: string;

  @Column('timestamp with time zone', {
    nullable: true,
  })
  public readonly value: Date | null;

  constructor(field: CustomField, diary: Diary, value: Date) {
    this.field = field;
    this.diary = diary;
    this.value = value;
  }
}
