export class ViewResponse {
  constructor(
    private readonly view: string,
    private readonly options: Record<string, string> = {},
  ) {}

  public getView(): string {
    return this.view;
  }

  public getOptions(): Record<string, string> {
    return this.options;
  }
}
