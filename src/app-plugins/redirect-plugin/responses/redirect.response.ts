import { HttpStatus } from '@nestjs/common';

export class RedirectResponse {
  constructor(
    private readonly redirectUri: string | URL,
    private readonly statusCode: HttpStatus = HttpStatus.FOUND,
  ) {}

  public getRedirectUri(): string {
    if (this.redirectUri instanceof URL) {
      return this.redirectUri.toString();
    }

    return this.redirectUri;
  }
  public getStatusCode(): HttpStatus {
    return this.statusCode;
  }
}
