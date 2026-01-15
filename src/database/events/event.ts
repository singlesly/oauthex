import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Apiary } from '../apiaries/apiary';
import { Hive } from '../hives/hive';
import { User } from '../users/user';
import { Diary } from '../diary/diary';
import { ApiProperty } from '@nestjs/swagger';

@Entity('calendar_events')
export class Event {
  @PrimaryGeneratedColumn('uuid') id!: string;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  @ApiProperty({ type: User })
  user!: User;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @ManyToOne(() => Apiary, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'apiary_id' })
  @ApiProperty({ type: Apiary })
  apiary!: Apiary;

  @Column({ name: 'apiary_id', type: 'uuid' })
  apiaryId!: string;

  @ManyToMany(() => Hive, { eager: true })
  @JoinTable({
    name: 'event_hives',
    joinColumn: { name: 'event_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'hive_id', referencedColumnName: 'id' },
  })
  @ApiProperty({ type: Hive, isArray: true })
  hives!: Hive[];

  @ManyToOne(() => Diary, { nullable: true })
  @JoinColumn({ name: 'diary_id' })
  @ApiProperty({ type: Diary })
  diary!: Diary | null;

  @Column({ name: 'start_at', type: 'timestamptz' })
  @ApiProperty()
  startAt!: Date;

  @Column({ name: 'end_at', type: 'timestamptz' })
  @ApiProperty()
  endAt!: Date;

  @Column({ name: 'notify_at', type: 'timestamptz', nullable: true })
  @ApiProperty()
  notifyAt?: Date | null;

  @Column({ name: 'notify_at_repeat', type: 'timestamptz', nullable: true })
  @ApiProperty()
  notifyAtRepeat?: Date | null;

  @Column({ type: 'text', nullable: true })
  @ApiProperty()
  description?: string | null;

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty()
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @ApiProperty()
  updatedAt!: Date;
}
