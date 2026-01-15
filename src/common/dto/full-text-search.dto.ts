import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsOptional, IsString } from 'class-validator';
import { ForbiddenException } from '@nestjs/common';

export class FullTextSearchDto {
  @ApiProperty({
    description: 'Паттерн для поиска',
    required: false,
    name: 'fts[pattern]',
  })
  @IsOptional()
  @IsString()
  public readonly pattern?: string;

  @ApiProperty({
    description:
      'Поведение поиска. contains - включает строку, starts - начинается с, ends - оканчивается на',
    enum: ['contains', 'starts', 'ends'],
    required: false,
    name: 'fts[type]',
  })
  @IsDefined()
  @IsString()
  public readonly type: 'contains' | 'starts' | 'ends' = 'contains';

  public getLikePattern() {
    if (this.type === 'contains') {
      return `%${this.pattern}%`;
    }

    if (this.type === 'starts') {
      return `${this.pattern}%`;
    }

    if (this.type === 'ends') {
      return `%${this.pattern}`;
    }

    throw new ForbiddenException(`Invalid fts type ${this.type}`);
  }
}
