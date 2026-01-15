import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString, MinLength } from 'class-validator';

export class RecoveryPasswordRequestDto {
  @ApiProperty({
    description: 'номер телефона пользователя',
  })
  @IsDefined()
  @IsString()
  public readonly login!: string;

  @ApiProperty({
    description: 'новый пароль',
  })
  @IsDefined()
  @IsString()
  @MinLength(6)
  public readonly password!: string;

  @ApiProperty({
    description: 'код отправленный в смс методом /ecpp/sms',
  })
  @IsDefined()
  @IsString()
  public readonly code!: string;
}
