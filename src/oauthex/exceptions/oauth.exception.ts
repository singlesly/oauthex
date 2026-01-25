import { OauthActionEnum } from '../enum/oauth-action.enum';
import { HttpStatus } from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm';

export class OauthException extends Error {
  public readonly fields: { name: string; errorMessage: string }[];
  public readonly message: string;
  public readonly action: OauthActionEnum;
  public readonly realm: string;
  public httpCode: HttpStatus = HttpStatus.BAD_REQUEST;

  constructor(
    realm: string,
    action: OauthActionEnum,
    fields: { name: string; errorMessage: string }[],
    message: string,
  ) {
    super(message);
    this.realm = realm;
    this.action = action;
    this.fields = fields;
    this.message = message;
  }

  public httpResponseCode(httpCode: HttpStatus): this {
    this.httpCode = httpCode;
    return this;
  }

  asJsonResponse() {
    return {
      message: this.message,
      fields: this.fields,
    };
  }
}
