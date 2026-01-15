import { Routes } from '@nestjs/core';
import { Type } from '@nestjs/common';
import { OauthModule } from './oauth/oauth.module';

export const adminModules: Type[] = [];

export const apiModules: Type[] = [OauthModule];

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
