export class ClientSettings {
  public readonly uiBaseUrl?: string | null;

  constructor(uiBaseUrl: string) {
    this.uiBaseUrl = uiBaseUrl;
  }
}