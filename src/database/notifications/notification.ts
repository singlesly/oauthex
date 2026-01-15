import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { NotificationStatusEnum } from './notification-status.enum';
import { NotificationSourceEnum } from './notification-source.enum';
import { randomUUID } from 'node:crypto';
import { NotificationTypeEnum } from './notification-type.enum';
import { Hive } from '../hives/hive';
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { NotificationInviteMetadata } from './metadata/notification-invite-metadata';
import { User } from '../users/user';
import { NotificationProjectEnum } from './notification-project.enum';

@Entity('notifications')
export class Notification<T = unknown> {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  public readonly id: string = randomUUID();

  @ManyToOne(() => Hive, {
    nullable: true,
  })
  @ApiProperty()
  public readonly hive: Hive | null;

  @ManyToOne(() => User, {
    nullable: true,
  })
  @ApiProperty()
  public readonly recipient: User | null;

  @Column({
    type: 'varchar',
    default: '',
  })
  @ApiProperty()
  public readonly title: string;

  @Column({
    type: 'varchar',
  })
  @ApiProperty()
  public readonly text: string;

  @Column({
    type: 'varchar',
  })
  @ApiProperty()
  public readonly source: NotificationSourceEnum;

  @Column({
    type: 'varchar',
    default: NotificationStatusEnum.NEW,
  })
  @ApiProperty()
  public status: NotificationStatusEnum = NotificationStatusEnum.NEW;

  @Column({
    type: 'varchar',
    default: NotificationTypeEnum.INFO,
  })
  @ApiProperty()
  public readonly type: NotificationTypeEnum = NotificationTypeEnum.INFO;

  @Column({
    type: 'varchar',
    enum: NotificationProjectEnum,
    default: NotificationProjectEnum.ECPP,
  })
  @ApiProperty()
  public readonly project?: NotificationProjectEnum;

  @ApiProperty({
    oneOf: [{ $ref: getSchemaPath(NotificationInviteMetadata) }],
  })
  @Column({
    type: 'jsonb',
    default: '{}',
  })
  public metadata: T = {} as T;

  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  @ApiProperty()
  public readonly createdAt!: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
  })
  @ApiProperty()
  public readonly updatedAt!: Date;

  constructor(
    hive: Hive | null,
    recipient: User | null,
    title: string,
    text: string,
    type: NotificationTypeEnum,
    source: NotificationSourceEnum,
    project: NotificationProjectEnum = NotificationProjectEnum.ECPP,
    metadata: T = {} as T,
  ) {
    this.hive = hive;
    this.recipient = recipient;
    this.title = title;
    this.text = text;
    this.type = type;
    this.source = source;
    this.project = project;
    this.metadata = metadata;
  }

  read() {
    this.status = NotificationStatusEnum.READ;
  }
}
