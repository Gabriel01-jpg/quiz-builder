import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../infra/database/prisma.service';
import { QuestionType } from '@prisma/client';
@Injectable()
export class QuizzRepository {
  private readonly logger = new Logger('QuizzRepository');
  constructor(private readonly prisma: PrismaService) {}

  async createQuizz(title: string, questions: any) {
    this.logger.log(`Creating quizz with title: ${title}`);
    try {
      const quiz = await this.prisma.quiz.create({
        data: {
          title,
          questions: {
            createMany: {
              data: questions.map((question: any) => ({
                type: QuestionType[question.type.toUpperCase()],
                content: question.content || '',
                options: question.options || [],
                correctAnswers: question.correctAnswers || [],
              })),
            },
          },
        },
      });

      return quiz;
    } catch (error) {
      this.logger.error('Error adding note audio unprocessed', error);
      throw error;
    }
  }

  async getQuizzes() {
    try {
      const quizzes = await this.prisma.quiz.findMany({
        include: {
          questions: true,
        },
      });
      return quizzes;
    } catch (error) {
      this.logger.error('Error fetching quizzes', error);
      throw error;
    }
  }

  async getQuizById(quiz_id: number) {
    try {
      const quiz = await this.prisma.quiz.findUnique({
        where: { id: quiz_id },
        include: {
          questions: true,
        },
      });
      if (!quiz) {
        throw new Error('Quiz not found');
      }
      return quiz;
    } catch (error) {
      this.logger.error(`Error fetching quiz by ID ${quiz_id}`, error);
      throw error;
    }
  }

  async deleteQuiz(quiz_id: number) {
    try {
      const deletedQuiz = await this.prisma.quiz.delete({
        where: { id: quiz_id },
      });
      return deletedQuiz;
    } catch (error) {
      this.logger.error(`Error deleting quiz with ID ${quiz_id}`, error);
      throw error;
    }
  }
}
