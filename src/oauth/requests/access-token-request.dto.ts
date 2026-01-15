import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString, ValidateIf } from 'class-validator';

export class AccessTokenRequestDto {
  @ApiProperty({
    enum: ['code', 'password', 'refresh_token'],
    description:
      'способ которым будет получен access token. Code - обмен кода на токен, password - обмен кредов пользователя на токен',
  })
  @IsDefined()
  @IsString()
  public readonly grant_type!: 'code' | 'password' | 'refresh_token';

  @ApiProperty({
    example: 'openid',
    description: 'всегда openid',
  })
  @IsDefined()
  @IsString()
  public readonly scope!: string;

  @ApiProperty({
    required: false,
    description:
      'Заполняется если grant_type == code. Код который получил клиент после авторизации пользователя',
  })
  @ValidateIf((o: AccessTokenRequestDto) => o.grant_type === 'code')
  @IsString()
  public readonly code!: string;

  @ApiProperty({
    required: false,
    description:
      'Заполняется если grant_type == code. редирект ссылка которая была указана при авторизации на /authorize',
  })
  @ValidateIf((o: AccessTokenRequestDto) => o.grant_type === 'code')
  @IsString()
  public readonly redirect_uri!: string;

  @ApiProperty({
    required: false,
    description:
      'Заполняется если grant_type == code. клиент который запрашивал авторизацию',
  })
  @ValidateIf((o: AccessTokenRequestDto) => o.grant_type === 'code')
  @IsString()
  public readonly client_id!: string;

  @ApiProperty({
    required: false,
    description:
      'Заполняется если grant_type == refresh_token. Обновляет токен доступа',
  })
  @ValidateIf((o: AccessTokenRequestDto) => o.grant_type === 'refresh_token')
  @IsString()
  public readonly refresh_token!: string;

  @ApiProperty({
    required: false,
    description:
      'Заполняется если grant_type == password. login/email/phone пользователя',
  })
  @ValidateIf((o: AccessTokenRequestDto) => o.grant_type === 'password')
  @IsString()
  public readonly username!: string;

  @ApiProperty({
    required: false,
    description: 'Заполняется если grant_type == password. Пароль пользователя',
  })
  @ValidateIf((o: AccessTokenRequestDto) => o.grant_type === 'password')
  @IsString()
  public readonly password!: string;
}
