import { Realm } from '../realms/realm';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Name } from './name';
import { Address } from './address';
import { Credentials } from './credentials';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Profile } from './profile';

/**
 * Данные пользователя для авторизации
 */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'pk_user_id',
  })
  @ApiProperty()
  public readonly id!: string;

  @ManyToOne(() => Realm)
  @JoinColumn({
    foreignKeyConstraintName: 'fk_user_realm',
  })
  @ApiProperty({
    type: Realm,
  })
  public readonly realm!: Realm;

  @Column(() => Credentials)
  @ApiProperty({
    type: Credentials,
  })
  public credentials!: Credentials;

  @Column(() => Name)
  @ApiProperty({
    type: Name,
  })
  public name!: Name;

  @Column(() => Address)
  @ApiProperty({
    type: Address,
  })
  public address!: Address;

  @Column(() => Profile)
  @ApiProperty({
    type: Profile,
  })
  public profile!: Profile;

  @CreateDateColumn()
  @ApiProperty()
  public readonly createdAt!: Date;

  @UpdateDateColumn()
  @ApiProperty()
  public readonly updatedAt!: Date;

  @DeleteDateColumn()
  @ApiProperty({
    type: Date,
  })
  @Exclude()
  public readonly deletedAt!: Date | null;

  constructor(
    realm: Realm,
    credentials: Credentials,
    name: Name,
    address: Address,
    profile: Profile,
  ) {
    this.realm = realm;
    this.credentials = credentials;
    this.name = name;
    this.address = address;
    this.profile = profile;
  }

  public updateCredentials(credentials: Credentials) {
    this.credentials = credentials;
  }
}
