import { Routes } from '@nestjs/core';
import { Type } from '@nestjs/common';
import { OauthModule } from './oauth/oauth.module';
import { SmsModule } from './sms/sms.module';
import { UserModule } from './user/user.module';
import { SearchModule } from './search/search.module';
import { ApiaryModule } from './apiary/apiary.module';
import { HiveModule } from './hive/hive.module';
import { DictionaryModule } from './dictionary/dictionary.module';
import { DiaryModule } from './diary/diary.module';
import { AttachmentModule } from './attachment/attachment.module';
import { EventsModule } from './events/events.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { StashModule } from './stash/stash.module';
import { FeedbackModule } from './feedback/feedback.module';
import { InviteModule } from './invite/invite.module';
import { AdminModule } from './admin/admin.module';
import { RequestModule } from './request/request.module';
import { FgisModule } from './fgis/fgis.module';
import { FrontendSettingsModule } from './frontend-settings/frontend-settings.module';

export const adminModules: Type[] = [AdminModule];

export const apiModules: Type[] = [
  AnalyticsModule,
  ApiaryModule,
  AttachmentModule,
  OauthModule,
  HiveModule,
  DictionaryModule,
  DiaryModule,
  FeedbackModule,
  SearchModule,
  SmsModule,
  UserModule,
  StashModule,
  EventsModule,
  NotificationsModule,
  InviteModule,
  RequestModule,
  FgisModule,
  FrontendSettingsModule,
];

export const routes: Routes = [
  {
    path: '/ecpp',
    children: [
      ...apiModules.map((module) => ({
        path: '',
        module,
      })),
      ...adminModules.map((module) => ({
        path: 'admin',
        module,
      })),
    ],
  },
];
