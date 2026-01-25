export class ClientSettings {
  public readonly uiBaseUrl: string;
  public readonly redirectUris: string[];

  constructor(uiBaseUrl: string, redirectUris: string[]) {
    this.uiBaseUrl = uiBaseUrl;
    this.redirectUris = redirectUris;
  }
}