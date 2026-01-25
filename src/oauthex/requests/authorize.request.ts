import { IsDefined, IsInstance, IsUrl } from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AuthorizeRequest {
  @ApiProperty({
    name: 'response_type',
  })
  @IsDefined()
  @Expose({ name: 'response_type' })
  public readonly responseType: 'code';

  @ApiProperty({
    name: 'client_id',
  })
  @IsDefined()
  @Expose({ name: 'client_id' })
  public readonly clientId: string;

  @ApiProperty({
    name: 'redirect_uri',
  })
  @IsDefined()
  @Expose({ name: 'redirect_uri' })
  @IsInstance(URL)
  @Transform((v) => {
    return new URL('', v.value);
  })
  public readonly redirectUri: URL;

  @ApiProperty({
    name: 'state',
  })
  @IsDefined()
  @Expose({ name: 'state' })
  public readonly state: string;

  @ApiProperty({
    name: 'code_challenge',
  })
  @IsDefined()
  @Expose({ name: 'code_challenge' })
  public readonly codeChallenge: string;

  @ApiProperty({
    name: 'code_challenge_method',
  })
  @IsDefined()
  @Expose({ name: 'code_challenge_method' })
  public readonly codeChallengeMethod: string;

  public toQueryString(): string {
    return Object.entries(this)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
  }
}
