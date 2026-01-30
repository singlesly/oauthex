import { Controller, Get, Param } from '@nestjs/common';
import { ViewResponse } from '@app/app-plugins/view-plugin/responses/view.response';
import { RealmName } from '@app/oauthex/decorators/realm-name';

@Controller('oauthex/pages/realms/:realm')
export class OauthexPagesController {
  @Get('app')
  public async app(@Param('realm') realm: string): Promise<ViewResponse> {
    return new ViewResponse('oauthex/app/app.hbs', {
      realm,
      clientId: 'web',
      clientSecret: '',
    });
  }

  @Get('sign-up')
  public async signup(@RealmName() realmName: string): Promise<ViewResponse> {
    return new ViewResponse('oauthex/signup.hbs', {
      realm: realmName,
      clientId: 'web',
      clientSecret: '',
    });
  }

  @Get('login')
  public async login(@RealmName() realmName: string): Promise<ViewResponse> {
    return new ViewResponse('oauthex/login.hbs', {
      realm: realmName,
      clientId: 'web',
      clientSecret: '',
    });
  }
}
