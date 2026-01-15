import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { join } from 'path';
import { AppConfig } from '../config/app.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseConfig } from '../config/database.config';
import { AuthorizationCodeRepository } from './authorization-codes/authorization-code.repository';
import { ClientRepository } from './clients/client.repository';
import { RealmRepository } from './realms/realm.repository';
import { UserRepository } from './users/user.repository';
import { SessionRepository } from './sessions/session.repository';
import { Realm } from './realms/realm';
import { Client } from './clients/client';
import { User } from './users/user';
import { Scope } from './scopes/scope';
import { AuthorizationCode } from './authorization-codes/authorization-code';
import { Session } from './sessions/session';

const entities = [
  Realm,
  Client,
  User,
  Scope,
  AuthorizationCode,
  Session,
];

const repositories = [
  AuthorizationCodeRepository,
  ClientRepository,
  RealmRepository,
  UserRepository,
  SessionRepository,
];

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService<AppConfig>) => {
        const database = config.getOrThrow<DatabaseConfig>('database');

        return {
          type: 'postgres',
          host: database.host,
          port: database.port,
          username: database.username,
          password: database.password,
          database: database.name,
          migrationsRun: database.migrationsRun,
          migrations: [join(process.cwd(), 'dist/database/migrations/*.js')],
          namingStrategy: new SnakeNamingStrategy(),
          logging: database.logging ? true : ['error'],
          connectTimeoutMS: 5000,
          autoLoadEntities: true,
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature(entities),
  ],
  providers: [...repositories],
  exports: [...repositories],
})
export class DatabaseModule {}
