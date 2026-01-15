import { ApiProperty } from '@nestjs/swagger';

export class AccessTokenResponseDto {
  @ApiProperty()
  public readonly access_token!: string;

  @ApiProperty()
  public readonly token_type!: string;

  @ApiProperty()
  public readonly refresh_token!: string;

  @ApiProperty()
  public readonly expires_in!: number;
}
