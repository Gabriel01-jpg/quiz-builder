import { Module } from '@nestjs/common';
import { BusinessModule } from './business/business.module';
import { ApiModule } from './api/api.module';
import { InfraModule } from './infra/infra.module';

@Module({
  imports: [BusinessModule, InfraModule, ApiModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
