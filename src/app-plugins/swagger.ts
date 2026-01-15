import { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';
import { adminModules, apiModules } from '../routes';
import { OauthModule } from '../oauth/oauth.module';

export function useSwagger(app: INestApplication): void {
  const baseConfig = new DocumentBuilder()
    .addBasicAuth(
      {
        type: 'http',
        scheme: 'basic',
      },
      'optional-basic-auth',
    )
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
    });
  const config = baseConfig
    .setTitle('API')
    .setVersion('1.0')
    .setExternalDoc(
      '* Эндпоинты для администрирования платформы',
      '/admin/docs',
    )
    .build();

  const adminConfig = new DocumentBuilder()
    .setTitle('API Администрирование ЕЦПП')
    .setVersion('1.0')
    .setExternalDoc('* Эндпоинты для клиенсткой платформы', '/ecpp/docs')
    .addBasicAuth(
      {
        type: 'http',
        scheme: 'basic',
      },
      'optional-basic-auth',
    )
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [],
    include: [...apiModules],
  });
  const adminDocument = SwaggerModule.createDocument(app, adminConfig, {
    extraModels: [],
    include: [...adminModules, OauthModule],
  });

  const theme = new SwaggerTheme();
  const options = {
    customCss: theme.getBuffer(SwaggerThemeNameEnum.FEELING_BLUE),
  };

  SwaggerModule.setup('/ecpp/docs', app, document, {
    ...options,
    customSiteTitle: 'API',
    swaggerOptions: {},
  } as SwaggerCustomOptions);

  SwaggerModule.setup('/ecpp/admin/docs', app, adminDocument, {
    ...options,
    customSiteTitle: 'API',
    swaggerOptions: {},
  } as SwaggerCustomOptions);
}
