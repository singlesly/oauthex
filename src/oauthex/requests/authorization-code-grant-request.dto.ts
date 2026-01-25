import { ApiProperty } from '@nestjs/swagger';

export class AuthorizationCodeGrantRequestDto {
  @ApiProperty({
    example: 'code',
    default: 'code',
    description:
      'способ которым будет получен access token, в случае значения code - будет редирект по ссылке и подставлен параметр code - который нужно будет обменять на токен в ендпоинте /token',
  })
  response_type!: 'code';

  @ApiProperty({
    description: 'клиент который запрашивает авторизацию - mobile/web',
  })
  client_id!: string;

  @ApiProperty({
    required: false,
    description:
      'ссылка по которой будет перенаправлен пользователь в случае успешной авторизации',
  })
  redirect_uri?: string;

  @ApiProperty({
    required: false,
    description:
      'скоуп доступов который будет у пользователя и данные которые будут использованы в jwt payload - всегда openid',
  })
  scope?: string;

  @ApiProperty({
    required: false,
    description: 'unsupported but described by RFC 6749',
  })
  /**
   * unsupported
   */
  state?: string;

  public toQueryString(): string {
    return Object.entries(this)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
  }
}
