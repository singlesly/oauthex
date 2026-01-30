import { ErrorCodeEnum } from '@app/oauthex/enum/error-code.enum';

export class OauthException extends Error {
  public readonly code: ErrorCodeEnum;

  constructor(code: ErrorCodeEnum, message: string) {
    super(message);
    this.code = code;
  }

  asJsonResponse() {
    return {
      code: this.code,
      message: this.message,
    };
  }
}
