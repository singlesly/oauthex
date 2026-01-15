import { databaseConfig, DatabaseConfig } from './database.config';
import { IsBoolean, IsDefined, IsInstance, IsOptional } from 'class-validator';
import { Config } from './config';
import { oauthConfig, OauthConfig } from './oauth.config';
import { s3Config, S3Config } from './s3.config';
import { collectorConfig, CollectorConfig } from './collector.config';
import {
  fgisSoapNativeConfig,
  FgisSoapNativeConfig,
} from './fgis-soap-native.config';
import { Expose, Transform } from 'class-transformer';
import {
  frontendSettingsConfig,
  FrontendSettingsConfig,
} from './frontend-settings.config';

export class AppConfig extends Config {
  @IsInstance(OauthConfig)
  @IsDefined()
  public oauth!: OauthConfig;

  @IsInstance(DatabaseConfig)
  @IsDefined()
  public database!: DatabaseConfig;

  @IsInstance(CollectorConfig)
  @IsDefined()
  public collector!: CollectorConfig;

  @Expose({ name: 'FGIS_ENABLE' })
  @IsOptional()
  @IsBoolean()
  @Transform((params) => params.value === 'true')
  public fgisEnable: boolean = false;

  @IsInstance(FgisSoapNativeConfig)
  @IsDefined()
  public fgisSoapNative!: FgisSoapNativeConfig;

  @IsInstance(S3Config)
  @IsDefined()
  public s3!: S3Config;

  @IsInstance(FrontendSettingsConfig)
  @IsDefined()
  public frontend!: FrontendSettingsConfig;
}

export const appConfig = new AppConfig()
  .fromProcessEnv(process.env)
  .setProperty('database', databaseConfig)
  .setProperty('oauth', oauthConfig)
  .setProperty('s3', s3Config)
  .setProperty('collector', collectorConfig)
  .setProperty('fgisSoapNative', fgisSoapNativeConfig)
  .setProperty('frontend', frontendSettingsConfig)
  .validate();
