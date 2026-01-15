import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { FindManyOptions } from 'typeorm';

export class PaginationDto {
  @ApiProperty({
    default: 0,
    description: 'Индекс страницы. Счет с нуля',
    required: false,
    name: 'index',
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  public readonly index: number = 0;

  @ApiProperty({
    default: 10,
    description: 'Количество элементов на странице',
    required: false,
    name: 'size',
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  public readonly size: number = 10;

  constructor(index: number = 0, size: number = 10) {
    this.index = index;
    this.size = size;
  }

  static max() {
    return new PaginationDto(0, Number.MAX_SAFE_INTEGER);
  }

  public getTake() {
    return this.size;
  }

  public getSkip() {
    return this.index * this.size;
  }

  public getTakeSkip(): Pick<FindManyOptions, 'take' | 'skip'> {
    return {
      take: this.getTake(),
      skip: this.getSkip(),
    };
  }
}
