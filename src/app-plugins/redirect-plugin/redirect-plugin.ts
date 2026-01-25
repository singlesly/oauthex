import { AppPlugin } from '@app/app-plugins/app-plugin';
import { NestExpressApplication } from '@nestjs/platform-express';
import { RedirectInterceptor } from '@app/app-plugins/redirect-plugin/interceptors/redirect.interceptor';

export class RedirectPlugin implements AppPlugin {
  install(app: NestExpressApplication): Promise<void> | void {
    app.useGlobalInterceptors(new RedirectInterceptor());
  }
}