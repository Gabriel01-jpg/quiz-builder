import { Module } from '@nestjs/common';
import { BusinessModule } from 'src/business/business.module';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';

@Module({
  imports: [BusinessModule],
  controllers: [QuizController],
  providers: [QuizService],
})
export class QuizModule {}
