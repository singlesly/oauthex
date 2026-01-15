import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Apiary } from '../apiaries/apiary';
import { ApiProperty } from '@nestjs/swagger';
import { Uterus } from './uterus';
import { Dictionary } from '../dictionary/dictionary';
import { Attachment } from '../attachments/attachment';
import { Diary } from '../diary/diary';

@Entity('hives')
export class Hive {
  public static sortableFields = [
    'number',
    'frames',
    'brood',
    'strength',
    'devices',
    'happiness',
    'createdAt',
    'uterus.year',
  ] as (keyof Hive)[];

  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  public readonly id!: string;

  @ManyToOne(() => Apiary)
  @ApiProperty({
    type: Apiary,
  })
  public readonly apiary: Apiary;

  @Column('int')
  @ApiProperty()
  public number: number;

  @Column(() => Uterus)
  @ApiProperty()
  public uterus!: Uterus;

  @Column('boolean')
  @ApiProperty()
  public isSmart: boolean = false;

  @Column('int', {
    default: 0,
  })
  @ApiProperty()
  public frames!: number;

  @Column('int', {
    default: 0,
  })
  @ApiProperty()
  public strength!: number;

  @Column('int', {
    default: 0,
  })
  @ApiProperty()
  public brood!: number;

  @Column('int', {
    default: 0,
  })
  @ApiProperty()
  public devices!: number;

  @Column('int', {
    default: 0,
  })
  @ApiProperty()
  public happiness!: number;

  @ManyToMany(() => Dictionary)
  @JoinTable({
    name: 'hives_dictionaries',
  })
  @ApiProperty({
    type: Dictionary,
    isArray: true,
  })
  public dictionaries!: Dictionary[];

  @ManyToMany(() => Attachment)
  @JoinTable({
    name: 'hives_attachments',
  })
  @ApiProperty({
    type: Attachment,
    isArray: true,
  })
  public attachments!: Attachment[];

  @CreateDateColumn({
    type: 'timestamptz',
  })
  @ApiProperty()
  public readonly createdAt: Date = new Date();

  @UpdateDateColumn({
    type: 'timestamptz',
  })
  @ApiProperty()
  public readonly updatedAt: Date = new Date();

  @DeleteDateColumn({
    type: 'timestamptz',
  })
  @ApiProperty()
  public readonly deletedAt: Date | null = null;

  constructor(
    apiary: Apiary,
    number: number,
    uterus: Uterus,
    isSmart: boolean = false,
  ) {
    this.number = number;
    this.apiary = apiary;
    this.uterus = uterus;
    this.isSmart = isSmart;
  }

  applyDiary(diary: Diary) {
    this.frames = diary.frames;
    this.brood = diary.brood;
    this.strength = diary.strength;
    if (diary.dictionaries?.length) {
      if (!Array.isArray(this.dictionaries)) {
        this.dictionaries = [];
      }
      this.dictionaries = diary.dictionaries;
    }
  }

  updateAttachments(attachments: Attachment[]) {
    if (!Array.isArray(this.attachments)) {
      this.attachments = [];
    }

    this.attachments = attachments;
  }
}
