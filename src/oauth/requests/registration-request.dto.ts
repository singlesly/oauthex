import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsDefined,
  IsEmail,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RegistrationRequestDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  public login!: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  public password!: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  public city?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsEmail()
  public email?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  public firstName?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  public lastName?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  public patronymic?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  public birthday?: Date;
}
