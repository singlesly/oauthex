import { Config } from './config';
import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsInstance, IsString } from 'class-validator';

export class OauthConfig extends Config {
  @Expose({ name: 'OAUTH_FRONTEND_URL' })
  @IsDefined()
  @IsInstance(URL)
  @Transform((params) => new URL('', String(params.value)))
  public readonly frontendUrl!: URL;

  @Expose({ name: 'OAUTH_JWT_SECRET' })
  @ApiProperty()
  @IsDefined()
  @IsString()
  public readonly jwtSecret!: string;
}

export const oauthConfig = new OauthConfig()
  .fromProcessEnv(process.env)
  .validate();
