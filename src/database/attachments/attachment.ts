import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('attachments')
export class Attachment {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  public readonly id!: string;

  @Column('varchar')
  public readonly path!: string;

  @CreateDateColumn()
  public readonly createdAt: Date = new Date();

  constructor(path: string) {
    this.path = path;
  }
}
