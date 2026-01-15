import { CrbResponse } from './crb-response';
import { PaginationDto } from './pagination.dto';
import { ApiProperty } from '@nestjs/swagger';
import { FullTextSearchDto } from './full-text-search.dto';
import { SortDto } from './sort.dto';

export class ListResponse<T> extends CrbResponse {
  public readonly items!: T[];

  @ApiProperty({
    description: 'Кол-во доступных элементов',
  })
  public readonly total: number;

  constructor(items: T[], total: number) {
    super();
    this.items = items;
    this.total = total;
  }

  withPagination(pagination: PaginationDto) {
    this.pagination = pagination;

    return this;
  }

  withFts(fts: FullTextSearchDto) {
    this.fts = fts;

    return this;
  }

  withSort(sort: SortDto) {
    this.sort = sort;

    return this;
  }
}
