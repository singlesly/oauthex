import { Expose, Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { Config } from './config';

export class DatabaseConfig extends Config {
  @Expose({ name: 'DB_HOST' })
  @IsDefined()
  @IsString()
  public readonly host!: string;

  @Expose({ name: 'DB_PORT' })
  @IsDefined()
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  public readonly port!: number;

  @Expose({ name: 'DB_USER' })
  @IsDefined()
  @IsString()
  public readonly username!: string;

  @Expose({ name: 'DB_PASS' })
  @IsDefined()
  @IsString()
  public readonly password!: string;

  @Expose({ name: 'DB_NAME' })
  @IsDefined()
  @IsString()
  public readonly name!: string;

  @Expose({ name: 'MIGRATIONS_RUN' })
  @IsOptional()
  @IsBoolean()
  @Transform((params) => params.value === 'true')
  public readonly migrationsRun!: boolean;

  @Expose({ name: 'DB_LOGGING' })
  @IsOptional()
  @IsBoolean()
  @Transform((params) => params.value === 'true')
  public readonly logging!: boolean;
}

export const databaseConfig = new DatabaseConfig()
  .fromProcessEnv(process.env)
  .validate();
