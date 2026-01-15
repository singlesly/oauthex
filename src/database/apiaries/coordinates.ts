import { Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export class Coordinates {
  @Column({
    comment: 'широта',
    type: 'varchar',
  })
  @ApiProperty()
  public readonly latitude: string;

  @Column({
    comment: 'долгота',
    type: 'varchar',
  })
  @ApiProperty()
  public readonly longitude: string;

  constructor(latitude: string, longitude: string) {
    this.latitude = latitude;
    this.longitude = longitude;
  }
}
