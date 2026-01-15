import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Hive } from '../hives/hive';
import { User } from '../users/user';
import { Dictionary } from '../dictionary/dictionary';
import { Event } from '../events/event';
import { ApiProperty } from '@nestjs/swagger';
import { Attachment } from '../attachments/attachment';

@Entity('diaries')
export class Diary {
  public static readonly sortableFields = [
    'inspectedAt',
    'brood',
    'frames',
    'strength',
    'author',
    'updatedAt',
    'hive',
  ] as (keyof Diary)[];

  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  public id!: string;

  @ManyToOne(() => Hive)
  @ApiProperty({
    type: Hive,
  })
  public hive!: Hive;

  @ManyToOne(() => User)
  @ApiProperty({
    type: User,
  })
  public author!: User;

  @Column('int')
  @ApiProperty()
  public frames!: number;

  @Column('int')
  @ApiProperty()
  public strength!: number;

  @Column('int')
  @ApiProperty()
  public brood!: number;

  @Column('varchar')
  @ApiProperty()
  public note!: string;

  @ManyToMany(() => Attachment)
  @JoinTable({ name: 'diaries_attachments' })
  @ApiProperty({
    type: Attachment,
    isArray: true,
  })
  public attachments!: Attachment[];

  @ManyToMany(() => Dictionary)
  @JoinTable({ name: 'diaries_dictionaries' })
  @ApiProperty({
    type: Dictionary,
    isArray: true,
  })
  public dictionaries!: Dictionary[];

  @OneToMany(() => Event, (e) => e.diary, {
    cascade: true,
    nullable: true,
  })
  @ApiProperty({
    type: Event,
    isArray: true,
  })
  public events!: Event[];

  @Column({
    default: () => 'NOW()',
    type: 'timestamp with time zone',
  })
  @ApiProperty({ description: 'дата осмотра улья' })
  public inspectedAt!: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  @ApiProperty()
  public readonly createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  @ApiProperty()
  public readonly updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  @ApiProperty()
  public readonly deletedAt!: Date;

  public specifyPower(frames: number, strength: number, brood: number): this {
    this.frames = frames;
    this.strength = strength;
    this.brood = brood;

    return this;
  }

  constructor(
    hive: Hive,
    dictionaries: Dictionary[],
    attachments: Attachment[],
    author: User,
    note: string,
    inspectedAt: Date,
  ) {
    this.hive = hive;
    if (dictionaries?.length) {
      this.dictionaries = dictionaries;
    }
    if (attachments?.length) {
      this.attachments = attachments;
    }
    this.author = author;
    this.note = note;
    this.inspectedAt = inspectedAt;
  }

  public update(
    dictionaries: Dictionary[],
    attachments: Attachment[],
    author: User,
    note: string,
    inspectedAt: Date,
    events?: Event[],
  ): this {
    this.dictionaries = dictionaries;
    this.attachments = attachments;
    this.author = author;
    this.note = note;
    this.inspectedAt = inspectedAt;

    return this;
  }
}
