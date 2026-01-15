import { Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export class Uterus {
  @Column({
    type: 'int',
    nullable: true,
  })
  @ApiProperty({
    nullable: true,
    type: 'number',
  })
  public readonly year!: number | null;

  @Column({
    type: 'int',
    nullable: true,
  })
  @ApiProperty({
    nullable: true,
    type: 'number',
  })
  public readonly mark!: number | null;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  public readonly breed!: string | null;

  @Column({
    type: 'varchar',
    default: '',
  })
  @ApiProperty({
    type: 'string',
  })
  public readonly color: string = '';

  constructor(year: number, mark: number, breed: string, color: string = '') {
    this.year = year;
    this.mark = mark;
    this.breed = breed;
    this.color = color;
  }
}
