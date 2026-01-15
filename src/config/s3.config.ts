import { Config } from './config';
import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDefined, IsOptional, IsString } from 'class-validator';

export class S3Config extends Config {
  @Expose({ name: 'S3_ENABLE' })
  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  @Transform((params) => params.value === 'true')
  public readonly enable: boolean = true;

  @Expose({ name: 'S3_ENDPOINT' })
  @ApiProperty()
  @IsDefined()
  @IsString()
  public readonly endpoint!: string;

  @Expose({ name: 'S3_REGION' })
  @ApiProperty()
  @IsDefined()
  @IsString()
  public readonly region!: string;

  @Expose({ name: 'S3_ACCESS_KEY' })
  @ApiProperty()
  @IsDefined()
  @IsString()
  public readonly accessKey!: string;

  @Expose({ name: 'S3_SECRET_KEY' })
  @ApiProperty()
  @IsDefined()
  @IsString()
  public readonly secretKey!: string;

  @Expose({ name: 'S3_BUCKET' })
  @ApiProperty()
  @IsDefined()
  @IsString()
  public readonly bucket!: string;

  @Expose({ name: 'S3_FORCE_PATH_STYLE' })
  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  @Transform((params) => params.value === 'true')
  public readonly forcePathStyle: boolean = true;
}

export const s3Config = new S3Config().fromProcessEnv(process.env).validate();
