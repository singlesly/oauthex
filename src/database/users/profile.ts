import { Attachment } from '../attachments/attachment';
import { Column, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export class Profile {
  @ManyToOne(() => Attachment, {
    nullable: true,
  })
  @ApiProperty({
    type: Attachment,
    nullable: true,
  })
  public readonly avatar!: Attachment | null;

  @Column({ type: 'timestamp with time zone', nullable: true })
  @ApiProperty({
    nullable: true,
    type: Date,
  })
  public readonly birthday!: Date | null;

  constructor(birthday?: Date, avatar?: Attachment) {
    this.birthday = birthday ?? null;
    this.avatar = avatar ?? null;
  }
}
