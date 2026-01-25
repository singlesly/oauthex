import { AppPlugin } from '@app/app-plugins/app-plugin';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ViewMiddleware } from '@app/common/middlewares/view.middleware';
import { ViewInterceptor } from '@app/common/interceptors/view.interceptor';

export class ViewPlugin implements AppPlugin {
  constructor(
    private readonly views: string,
    private readonly engine: 'hbs',
  ) {}

  install(app: NestExpressApplication): Promise<void> | void {
    app.setBaseViewsDir(join(process.cwd(), this.views));
    app.setViewEngine(this.engine);

    const viewMiddleware = new ViewMiddleware();
    app.use(viewMiddleware.use.bind(viewMiddleware));

    app.useGlobalInterceptors(new ViewInterceptor());
  }
}
