import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class AuthenticateRequestDto {
  @ApiProperty({
    description: 'логин пользователя может быть login/phone/email',
  })
  @IsDefined()
  @IsString()
  public readonly login!: string;

  @ApiProperty({
    description: 'пароль пользователя',
  })
  @IsDefined()
  @IsString()
  public readonly password!: string;
}
