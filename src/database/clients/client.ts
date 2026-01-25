import { Realm } from '../realms/realm';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { ClientSettings } from '@app/database/clients/client-settings';
import { Type } from 'class-transformer';

/**
 * https://datatracker.ietf.org/doc/html/rfc6749#autoid-15
 */
@Entity('clients')
export class Client {
  @PrimaryColumn('varchar', {
    primaryKeyConstraintName: 'pk_clients_id',
  })
  public readonly id!: string;

  @ManyToOne(() => Realm)
  public readonly realm!: Realm;

  @Column('jsonb')
  @Type(() => ClientSettings)
  public readonly settings: ClientSettings;

  constructor(id: string, realm: Realm, settings: ClientSettings) {
    this.id = id;
    this.realm = realm;
    this.settings = settings;
  }
}
