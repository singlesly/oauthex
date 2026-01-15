import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Apiary } from '../apiaries/apiary';
import { User } from '../users/user';
import { randomUUID } from 'node:crypto';

@Entity('invites')
export class Invite {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  public readonly id: string = randomUUID();

  @ManyToOne(() => Apiary, {
    eager: true,
  })
  @ApiProperty({
    type: Apiary,
  })
  public readonly apiary: Apiary;

  @ManyToOne(() => User, {
    eager: true,
  })
  @ApiProperty({
    type: User,
  })
  public readonly user: User;

  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  public readonly createdAt: Date = new Date();

  constructor(apiary: Apiary, user: User) {
    this.apiary = apiary;
    this.user = user;
  }
}
