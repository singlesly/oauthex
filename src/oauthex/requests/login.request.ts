import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class LoginRequest {
  @ApiProperty()
  @IsDefined()
  @IsString()
  public readonly login: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  public readonly password: string;
}