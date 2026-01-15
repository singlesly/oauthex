import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('requests')
export class Request {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  public readonly id!: string;

  @Column('varchar')
  @ApiProperty()
  public readonly method!: string;

  @Column('varchar')
  @ApiProperty()
  public readonly path!: string;

  @Column('jsonb')
  @ApiProperty({
    type: 'object',
    properties: {},
  })
  public readonly body!: Record<string, unknown>;

  @Column('jsonb')
  @ApiProperty({
    type: 'object',
    properties: {},
  })
  public readonly query!: Record<string, string>;

  @Column('jsonb')
  @ApiProperty({
    type: 'object',
    properties: {},
  })
  public readonly headers!: Record<string, string>;

  @Column('uuid')
  @ApiProperty({})
  public readonly userId!: string;

  @Column({
    type: 'timestamp with time zone',
  })
  @ApiProperty()
  public readonly createdAt!: Date;
}
