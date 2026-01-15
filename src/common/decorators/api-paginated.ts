import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function ApiPaginated() {
  return applyDecorators(
    ApiQuery({
      name: 'page[index]',
      type: Number,
      required: false,
      default: 0,
    }),
    ApiQuery({
      name: 'page[size]',
      type: Number,
      required: false,
      default: 10,
    }),
  );
}
