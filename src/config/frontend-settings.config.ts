import { Config } from './config';
import { Expose } from 'class-transformer';
import { IsDefined, IsString } from 'class-validator';

export class FrontendSettingsConfig extends Config {
  @Expose({ name: 'WEB_VITE_AUTH_HOST' })
  @IsDefined()
  @IsString()
  WEB_VITE_AUTH_HOST!: string;

  @Expose({ name: 'WEB_VITE_SHARE_HOST' })
  @IsDefined()
  @IsString()
  WEB_VITE_SHARE_HOST!: string;

  @Expose({ name: 'WEB_VITE_DADATA_TOKEN' })
  @IsDefined()
  @IsString()
  WEB_VITE_DADATA_TOKEN!: string;

  @Expose({ name: 'WEB_VITE_YANDEX_TOKEN' })
  @IsDefined()
  @IsString()
  WEB_VITE_YANDEX_TOKEN!: string;

  @Expose({ name: 'ADMIN_VITE_ADMIN_HOST' })
  @IsDefined()
  @IsString()
  ADMIN_VITE_ADMIN_HOST!: string;

  @Expose({ name: 'ADMIN_VITE_API_URL' })
  @IsDefined()
  @IsString()
  // admin
  ADMIN_VITE_API_URL!: string;

  @Expose({ name: 'ADMIN_VITE_API_ECPP_URL' })
  @IsDefined()
  @IsString()
  ADMIN_VITE_API_ECPP_URL!: string;

  @Expose({ name: 'ADMIN_VITE_API_BEE_SHARE_URL' })
  @IsDefined()
  @IsString()
  ADMIN_VITE_API_BEE_SHARE_URL!: string;
}

export const frontendSettingsConfig = new FrontendSettingsConfig()
  .fromProcessEnv(process.env)
  .validate();
