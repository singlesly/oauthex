import { Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export class Profile {
  @Column({ type: 'timestamp with time zone', nullable: true })
  @ApiProperty({
    nullable: true,
    type: Date,
  })
  public readonly birthday!: Date | null;

  constructor(birthday?: Date) {
    this.birthday = birthday ?? null;
  }
}
