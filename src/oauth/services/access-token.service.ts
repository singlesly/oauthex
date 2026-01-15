import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { AccessTokenRequestDto } from '../requests/access-token-request.dto';
import { AccessTokenResponseDto } from '../responses/access-token-response.dto';
import { AuthorizationCodeRepository } from '../../database/authorization-codes/authorization-code.repository';
import { UserRepository } from '../../database/users/user.repository';
import { ClientRepository } from '../../database/clients/client.repository';
import { AuthorizationCodeService } from './authorization-code.service';
import { User } from '../../database/users/user';
import { RefreshTokenPayload } from '../../extensions/auth/guards/token-payload';
import { OauthException } from '../exceptions/oauth.exception';
import { OauthActionEnum } from '../enum/oauth-action.enum';

@Injectable()
export class AccessTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authorizationCodeRepository: AuthorizationCodeRepository,
    private readonly userRepository: UserRepository,
    private readonly clientRepository: ClientRepository,
    private readonly authorizationCodeService: AuthorizationCodeService,
  ) {}

  public async issue(
    request: AccessTokenRequestDto,
    clientId?: string,
  ): Promise<AccessTokenResponseDto> {
    if (request.grant_type === 'code') {
      const code = await this.authorizationCodeRepository.findOrFail(
        request.code,
      );

      const { accessToken, refreshToken, expiresIn } = await this.issueToken(
        code.user,
      );

      return {
        access_token: accessToken,
        expires_in: expiresIn,
        refresh_token: refreshToken,
        token_type: 'Bearer',
      };
    }

    if (request.grant_type === 'password') {
      if (!clientId) {
        throw new Error('client credentials is required');
      }

      const client = await this.clientRepository.findByIdOrFail(clientId);

      const user = await this.userRepository.findByLoginOrFail(
        request.username,
        client.realm.name,
      );

      if (user.credentials.password !== request.password) {
        throw new OauthException(
          client.realm.name,
          OauthActionEnum.LOGIN,
          [{ name: 'password', errorMessage: 'Неверный пароль' }],
          'Неверный пароль',
        ).httpResponseCode(HttpStatus.BAD_REQUEST);
      }

      const { accessToken, refreshToken, expiresIn } =
        await this.issueToken(user);

      return {
        access_token: accessToken,
        expires_in: expiresIn,
        refresh_token: refreshToken,
        token_type: 'Bearer',
      };
    }

    if (request.grant_type === 'refresh_token') {
      if (!clientId) {
        throw new Error('client credentials is required');
      }

      const refreshTokenPayload: RefreshTokenPayload =
        await this.jwtService.verifyAsync(request.refresh_token);

      await this.clientRepository.findByIdOrFail(clientId);

      const user = await this.userRepository.findByIdOrFail(
        refreshTokenPayload.sub,
      );

      const { accessToken, refreshToken, expiresIn } =
        await this.issueToken(user);

      return {
        access_token: accessToken,
        expires_in: expiresIn,
        refresh_token: refreshToken,
        token_type: 'Bearer',
      };
    }

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    throw new Error(`unsupported grant type is ${request.grant_type}`);
  }

  private async issueToken(user: User): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }> {
    const expiresIn = 8 * 60 * 60;

    const tokenOptions: JwtSignOptions = {
      expiresIn,
      issuer: 'ecpp',
      audience: ['user'],
      subject: user.id,
    };

    const accessToken = await this.jwtService.signAsync(
      {
        fullName: user.name.fullName,
        email: user.credentials.email,
        phone: user.credentials.login,
        city: user.address.city,
      },
      tokenOptions,
    );
    const refreshToken = await this.jwtService.signAsync(
      {},
      {
        ...tokenOptions,
        expiresIn: '180d',
      },
    );

    return { accessToken, refreshToken, expiresIn };
  }
}
