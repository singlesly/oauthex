import express from 'express';

export class CookieStorage {
  constructor(private readonly request: express.Request) {}

  public getAll(): Record<string, string> {
    return this.request.cookies as Record<string, string>;
  }

  public getOne(path: string): string | undefined {
    return this.getAll()[path];
  }
}
