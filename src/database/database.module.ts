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
import { Apiary } from './apiaries/apiary';
import { ApiaryRepository } from './apiaries/apiary.repository';
import { Hive } from './hives/hive';
import { HiveRepository } from './hives/hive.repository';
import { DictionaryRepository } from './dictionary/dictionary.repository';
import { Dictionary } from './dictionary/dictionary';
import { Diary } from './diary/diary';
import { DiaryRepository } from './diary/diary.repository';
import { Attachment } from './attachments/attachment';
import { AttachmentRepository } from './attachments/attachment.repository';
import { NotificationRepository } from './notifications/notification.repository';
import { Notification } from './notifications/notification';
import { Event } from './events/event';
import { EventsRepository } from './events/events.repository';
import { InviteRepository } from './invites/invite.repository';
import { Invite } from './invites/invite';
import { CustomField } from './custom-fields/custom-field';
import { CustomFieldValueDate } from './custom-fields/custom-field-value-date';
import { CustomFieldValueDictionary } from './custom-fields/custom-field-value-dictionary';
import { CustomFieldValueString } from './custom-fields/custom-field-value-string';
import { CustomFieldRepository } from './custom-fields/custom-field.repository';
import { CustomFieldValueNumber } from './custom-fields/custom-field-value-number';
import { CustomFieldValueRepository } from './custom-fields/custom-field-value.repository';
import { RequestRepository } from './requests/request.repository';
import { Request } from './requests/request';

const entities = [
  Apiary,
  Attachment,
  Realm,
  Client,
  User,
  Scope,
  AuthorizationCode,
  Session,
  Hive,
  Dictionary,
  Diary,
  Notification,
  Event,
  Invite,
  CustomField,
  CustomFieldValueDate,
  CustomFieldValueDictionary,
  CustomFieldValueNumber,
  CustomFieldValueString,
  Request,
];

const repositories = [
  AuthorizationCodeRepository,
  AttachmentRepository,
  ClientRepository,
  RealmRepository,
  UserRepository,
  SessionRepository,
  ApiaryRepository,
  HiveRepository,
  DictionaryRepository,
  DiaryRepository,
  NotificationRepository,
  EventsRepository,
  InviteRepository,
  CustomFieldRepository,
  CustomFieldValueRepository,
  RequestRepository,
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
