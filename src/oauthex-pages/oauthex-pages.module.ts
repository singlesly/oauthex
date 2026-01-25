import { Module } from '@nestjs/common';
import { OauthexPagesController } from '@app/oauthex-pages/controllers/oauthex-pages.controller';

@Module({
  imports: [],
  controllers: [OauthexPagesController],
})
export class OauthexPagesModule {}
