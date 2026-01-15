import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { PaginationDto } from '../dto/pagination.dto';

export const Pagination = createParamDecorator(
  (_: unknown, context: ExecutionContext): PaginationDto => {
    const request = context.switchToHttp().getRequest<Request>();

    const query = request.query;

    const pageIndex = query['page[index]'];
    const pageSize = query['page[size]'];

    const pagination = new PaginationDto(
      Number(pageIndex ?? 0),
      Number(pageSize ?? 10),
    );

    return pagination;
  },
);
