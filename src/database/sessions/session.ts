import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user';
import { Client } from '../clients/client';

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'pk_sessions_id',
  })
  public readonly id: string;

  @ManyToOne(() => User)
  public readonly user: User;

  @ManyToOne(() => Client)
  public readonly client: Client;

  @CreateDateColumn()
  public readonly createdAt!: Date;

  constructor(id: string, user: User, client: Client) {
    this.id = id;
    this.user = user;
    this.client = client;
  }
}
