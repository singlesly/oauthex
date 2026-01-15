import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { FindOptionsOrder } from 'typeorm';

export class SortDto {
  @ApiProperty({
    description:
      'колонка по которой произвести поиск - по дефолту будет дата создания записи',
    required: false,
    name: 'sort[field]',
  })
  @IsOptional()
  @IsString()
  public readonly field?: string;

  @ApiProperty({
    description: 'Направление сортировки',
    enum: ['ASC', 'DESC'],
    required: false,
    name: 'sort[direction]',
  })
  @IsOptional()
  @IsString()
  public readonly direction: 'ASC' | 'DESC' = 'ASC';

  public getTypeormOptions<T>(): FindOptionsOrder<T> {
    if (!this.field) {
      return {};
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return {
      [this.field]: this.direction,
    };
  }
}
