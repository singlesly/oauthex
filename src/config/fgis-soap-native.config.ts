import { Expose, Type } from 'class-transformer';
import { IsDefined, IsInt, IsPositive, IsString } from 'class-validator';
import { Config } from './config';

export class FgisSoapNativeConfig extends Config {
  @Expose({ name: 'SD_FGIS_SOAP_NATIVE_PROTOCOL' })
  @IsDefined()
  @IsString()
  public readonly protocol: string = 'https';

  @Expose({ name: 'SD_FGIS_SOAP_NATIVE_HOST' })
  @IsDefined()
  @IsString()
  public readonly host!: string;

  @Expose({ name: 'SD_FGIS_SOAP_NATIVE_PORT' })
  @IsDefined()
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  public readonly port!: number;
}

export const fgisSoapNativeConfig = new FgisSoapNativeConfig()
  .fromProcessEnv(process.env)
  .validate();
