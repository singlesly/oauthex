export class AuthorizationCodeResponse {
  public readonly code: string;

  constructor(code: string) {
    this.code = code;
  }
}