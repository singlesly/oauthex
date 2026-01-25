import { Controller, Get, Param } from '@nestjs/common';
import { ViewResponse } from '@app/app-plugins/view-plugin/responses/view.response';

@Controller('oauthex/pages/realms/:realm')
export class OauthexPagesController {
  @Get('app')
  public async app(@Param('realm') realm: string): Promise<ViewResponse> {
    return new ViewResponse('oauthex/app/app.hbs', {
      realm,
    });
  }

  @Get('login')
  public async login(): Promise<ViewResponse> {
    return new ViewResponse('oauthex/login.hbs', {});
  }
}
