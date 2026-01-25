import { Routes } from '@nestjs/core';
import { Type } from '@nestjs/common';
import { OauthexModule } from '@app/oauthex/oauthex.module';

export const adminModules: Type[] = [];

export const apiModules: Type[] = [OauthexModule];

export const routes: Routes = [
  {
    path: '/',
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
