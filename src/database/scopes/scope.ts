import { Realm } from '../realms/realm';

/**
 * https://datatracker.ietf.org/doc/html/rfc6749#section-3.3
 */
export class Scope {
  public readonly realm!: Realm;
}
