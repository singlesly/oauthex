import { Client } from '../clients/client';
import { Realm } from '../realms/realm';
import { User } from '../users/user';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * https://datatracker.ietf.org/doc/html/rfc6749#autoid-35
 */
@Entity('authorization_codes')
export class AuthorizationCode {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'pk_authorization_codes_id',
  })
  public readonly code!: string;

  @ManyToOne(() => Realm)
  public readonly realm!: Realm;

  @ManyToOne(() => User)
  public readonly user!: User;

  @ManyToOne(() => Client)
  public readonly client!: Client;

  @Column('varchar')
  public readonly redirectUri: string;

  @CreateDateColumn()
  public readonly createdAt!: Date;

  constructor(
    code: string,
    realm: Realm,
    user: User,
    client: Client,
    redirectUri: string,
  ) {
    this.code = code;
    this.realm = realm;
    this.user = user;
    this.client = client;
    this.redirectUri = redirectUri;
  }
}
