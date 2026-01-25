import { AppPlugin } from '@app/app-plugins/app-plugin';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ViewMiddleware } from '@app/app-plugins/view-plugin/middlewares/view.middleware';
import { ViewInterceptor } from '@app/app-plugins/view-plugin/interceptors/view.interceptor';

export class ViewPlugin implements AppPlugin {
  constructor(
    private readonly views: string,
    private readonly engine: 'hbs',
    private readonly partials?: string,
  ) {}

  install(app: NestExpressApplication): void {
    app.setBaseViewsDir(join(process.cwd(), this.views));
    app.setViewEngine(this.engine);

    const viewMiddleware = new ViewMiddleware();
    app.use(viewMiddleware.use.bind(viewMiddleware));

    app.useGlobalInterceptors(new ViewInterceptor());

    if (this.partials) {
      const hbs= require('hbs');
      hbs.registerPartials(join(process.cwd(), this.partials));
    }
  }
}
