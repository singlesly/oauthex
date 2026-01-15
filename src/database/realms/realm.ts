import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

/**
 * Пространство для пользователей, клиентов, скоупов и настроек в рамках одного инстанса oauth.
 * Можно считать что этот класс отвечает за разделение а-ля неймспейс
 */
@Entity('realms')
export class Realm {
  @PrimaryColumn({
    primaryKeyConstraintName: 'pk_realm_name',
  })
  public readonly name!: string;

  @CreateDateColumn()
  @Exclude()
  public readonly createdAt!: Date;

  @UpdateDateColumn()
  @Exclude()
  public readonly updatedAt!: Date;

  @DeleteDateColumn()
  @Exclude()
  public readonly deletedAt!: Date | null;

  constructor(name: string) {
    this.name = name;
  }
}
