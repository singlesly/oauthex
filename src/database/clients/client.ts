import { Realm } from '../realms/realm';
import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';

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

  constructor(id: string, realm: Realm) {
    this.id = id;
    this.realm = realm;
  }
}
