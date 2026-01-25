import { IsDefined, IsEnum, IsInstance, IsUrl } from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AuthorizeRequest {
  @ApiProperty({
    name: 'response_type',
  })
  @IsDefined({
    message: 'response_type should not be null or undefined',
  })
  @Expose({ name: 'response_type' })
  public readonly responseType: 'code';

  @ApiProperty({
    name: 'client_id',
  })
  @IsDefined({
    message: 'client_id should not be null or undefined',
  })
  @Expose({ name: 'client_id' })
  public readonly clientId: string;

  @ApiProperty({
    name: 'redirect_uri',
  })
  @IsDefined({
    message: 'redirect_uri should not be null or undefined',
  })
  @Expose({ name: 'redirect_uri' })
  @IsInstance(URL, {
    message: 'redirect_uri must be uri',
  })
  @Transform(({ value }): unknown => {
    if (!value) {
      return value;
    }

    return new URL('', value as string);
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
  @IsDefined({
    message: 'code_challenge should not be null or undefined',
  })
  @Expose({ name: 'code_challenge' })
  public readonly codeChallenge: string;

  @ApiProperty({
    name: 'code_challenge_method',
  })
  @IsDefined({
    message: 'code_challenge_method should not be null or undefined',
  })
  @Expose({ name: 'code_challenge_method' })
  @IsEnum(['S256'], {
    message: 'code_challenge_method must be S256',
  })
  public readonly codeChallengeMethod: string;

  public toQueryString(): string {
    return Object.entries(this)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
  }
}
