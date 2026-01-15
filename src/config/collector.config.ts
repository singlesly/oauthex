import { Config } from './config';
import { IsDefined, IsInt, IsPositive, IsString } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class CollectorConfig extends Config {
  @Expose({ name: 'SD_COLLECTOR_PROTOCOL' })
  @IsDefined()
  @IsString()
  public readonly protocol: string = 'https';

  @Expose({ name: 'SD_COLLECTOR_HOST' })
  @IsDefined()
  @IsString()
  public readonly host!: string;

  @Expose({ name: 'SD_COLLECTOR_PORT' })
  @IsDefined()
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  public readonly port!: number;
}

export const collectorConfig = new CollectorConfig()
  .fromProcessEnv(process.env)
  .validate();
