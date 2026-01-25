import { Controller, Get } from '@nestjs/common';
import { ViewResponse } from '@app/app-plugins/view-plugin/responses/view.response';

@Controller('oauthex/pages/realms/:realm')
export class OauthexPagesController {
  @Get('login')
  public async login(): Promise<ViewResponse> {
    return new ViewResponse('oauthex/login.hbs', {});
  }
}
