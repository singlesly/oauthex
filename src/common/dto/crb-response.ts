import { SortDto } from './sort.dto';
import { PaginationDto } from './pagination.dto';
import { FullTextSearchDto } from './full-text-search.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, ValidateNested } from 'class-validator';

export abstract class CrbResponse {
  @ApiProperty({
    type: SortDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  public sort?: SortDto;

  @ApiProperty({
    type: PaginationDto,
    required: false,
  })
  @ValidateNested()
  public pagination?: PaginationDto;

  @ApiProperty({
    type: FullTextSearchDto,
    required: false,
  })
  @ValidateNested()
  public fts?: FullTextSearchDto;
}
