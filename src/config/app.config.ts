import { databaseConfig, DatabaseConfig } from './database.config';
import { IsDefined, IsInstance } from 'class-validator';
import { Config } from './config';
import { oauthConfig, OauthConfig } from './oauth.config';

export class AppConfig extends Config {
  @IsInstance(OauthConfig)
  @IsDefined()
  public oauth!: OauthConfig;

  @IsInstance(DatabaseConfig)
  @IsDefined()
  public database!: DatabaseConfig;
}

export const appConfig = new AppConfig()
  .fromProcessEnv(process.env)
  .setProperty('database', databaseConfig)
  .setProperty('oauth', oauthConfig)
  .validate();
