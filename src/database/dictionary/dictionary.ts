import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Apiary } from '../apiaries/apiary';
import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'node:crypto';
import { Type } from 'class-transformer';
import { DictionaryTypeEnum } from './dictionary-type.enum';

@Entity('dictionaries')
export class Dictionary {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  public readonly id: string = randomUUID();

  @Column('varchar')
  @ApiProperty()
  public name: string;

  @Column('text', {
    default: '',
  })
  @ApiProperty()
  public description: string;

  @ManyToOne(() => Apiary)
  @Type(() => Apiary)
  @ApiProperty({
    type: Apiary,
  })
  public apiary: Apiary;

  @Column({
    type: 'varchar',
    default: DictionaryTypeEnum.DIARY,
  })
  @ApiProperty({
    enum: DictionaryTypeEnum,
  })
  public type: DictionaryTypeEnum | string;

  @CreateDateColumn({
    type: 'timestamptz',
  })
  public readonly createdAt: Date = new Date();

  @UpdateDateColumn({
    type: 'timestamptz',
  })
  public readonly updatedAt: Date = new Date();

  @DeleteDateColumn({
    type: 'timestamptz',
  })
  public readonly deletedAt: Date | null = null;

  constructor(
    apiary: Apiary,
    name: string,
    description: string,
    type: DictionaryTypeEnum | string,
  ) {
    this.apiary = apiary;
    this.name = name;
    this.type = type;
    this.description = description;
  }
}
