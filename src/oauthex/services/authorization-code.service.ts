import { Injectable } from '@nestjs/common';
import { AuthorizationCodeRepository } from '../../database/authorization-codes/authorization-code.repository';
import { SessionRepository } from '../../database/sessions/session.repository';
import { AuthorizationCode } from '../../database/authorization-codes/authorization-code';
import { randomUUID } from 'node:crypto';
import { Session } from '../../database/sessions/session';
import { Realm } from '../../database/realms/realm';
import { User } from '../../database/users/user';
import { Client } from '../../database/clients/client';

export interface IssuedAuthorizationCode {
  code: AuthorizationCode;
  session: Session;
}

@Injectable()
export class AuthorizationCodeService {
  constructor(
    private readonly authorizationCodeRepository: AuthorizationCodeRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async issue(
    realm: Realm,
    user: User,
    client: Client,
    redirectUri: string,
  ): Promise<IssuedAuthorizationCode> {
    const code = new AuthorizationCode(
      randomUUID(),
      realm,
      user,
      client,
      redirectUri,
    );
    const session = new Session(randomUUID(), user, client);

    await this.authorizationCodeRepository.save(code);
    await this.sessionRepository.save(session);

    return { code, session };
  }

  public async issueBySessionId(
    sessionId: string,
    redirectUri: string,
  ): Promise<IssuedAuthorizationCode> {
    const session = await this.sessionRepository.findOneByIdOrFail(sessionId);

    return this.issue(
      session.user.realm,
      session.user,
      session.client,
      redirectUri,
    );
  }
}
