import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class DateRangeDto {
  @ApiProperty({
    type: Date,
    description: 'Диапазон даты начало, если не передать не в качестве условия',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  public readonly from?: Date;

  @ApiProperty({
    type: Date,
    description:
      'Диапазон даты конец, если не передать не будет в качестве условия',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  public readonly to?: Date;
}
