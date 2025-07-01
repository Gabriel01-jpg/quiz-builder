import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/infra/database/prisma.module';
import { QuizzRepository } from './repositories/quizz.repository';

@Module({
  imports: [PrismaModule],
  providers: [QuizzRepository],
  exports: [QuizzRepository],
})
export class BusinessModule {}
