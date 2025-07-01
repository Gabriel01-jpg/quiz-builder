import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuizDTO } from './dto/createQuiz-dto';

@Controller('quizzes')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  async createQuizz(@Body() { title, questions }: CreateQuizDTO) {
    console.log('Creating quiz with title:', title);
    return this.quizService.createQuizz({ title, questions });
  }

  @Get()
  async getQuizzes() {
    return this.quizService.getQuizzes();
  }

  @Get('/:quiz_id')
  async getQuizById(@Param('quiz_id') quiz_id: number) {
    return this.quizService.getQuizById(Number(quiz_id));
  }

  @Delete('/:quiz_id')
  async deleteQuiz(@Param('quiz_id') quiz_id: number) {
    return this.quizService.deleteQuiz(Number(quiz_id));
  }
}
