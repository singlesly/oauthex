import { ApiProperty } from '@nestjs/swagger';

export class FilterDto {
  @ApiProperty({
    type: [String],
  })
  public readonly include?: string[];
}
