import { Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class Credentials {
  @Column({
    unique: true,
    nullable: true,
    type: 'varchar',
  })
  @ApiProperty({
    type: String,
  })
  public readonly email!: string | null;

  @Column({
    unique: true,
  })
  @ApiProperty()
  public readonly login!: string;

  @Column({
    nullable: true,
    type: 'varchar',
  })
  @Exclude()
  public readonly password!: string | null;

  constructor(login: string, email?: string | null, password?: string | null) {
    this.login = login;
    this.email = email ?? null;
    this.password = password ?? null;
  }
}
