import {
  ApiExtraModels,
  ApiOkResponse,
  ApiResponseOptions,
  getSchemaPath,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { ListResponse } from '../dto/list-response';

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function ApiListResponse<T extends Function>(
  cls: T,
  options: ApiResponseOptions = {},
) {
  return applyDecorators(
    ApiExtraModels(ListResponse, cls),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ListResponse) },
          {
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(cls) },
              },
              sort: {
                properties: {
                  'sort[field]': {
                    description: 'Поля для сортировки',
                    enum: [
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-expect-error
                      ...Object.keys(new cls()),
                    ],
                  },
                },
              },
            },
          },
        ],
      },
      ...options,
    }),
  );
}
