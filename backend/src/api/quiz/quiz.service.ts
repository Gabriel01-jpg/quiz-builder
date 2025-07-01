import { Injectable } from '@nestjs/common';
import { QuizzRepository } from 'src/business/repositories/quizz.repository';
import { CreateQuizDTO } from './dto/createQuiz-dto';

@Injectable()
export class QuizService {
  constructor(private readonly quizRepository: QuizzRepository) {}

  async createQuizz({ title, questions }: CreateQuizDTO) {
    try {
      return this.quizRepository.createQuizz(title, questions);
    } catch (error) {
      console.error('Error creating quiz:', error);
      throw error;
    }
  }

  async getQuizzes() {
    try {
      return this.quizRepository.getQuizzes();
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      throw error;
    }
  }

  async getQuizById(quiz_id: number) {
    try {
      if (!quiz_id) {
        throw new Error('Quiz ID is required');
      }
      return this.quizRepository.getQuizById(quiz_id);
    } catch (error) {
      console.error('Error fetching quiz by ID:', error);
      throw error;
    }
  }

  async deleteQuiz(quiz_id: number) {
    try {
      if (!quiz_id) {
        throw new Error('Quiz ID is required');
      }
      return this.quizRepository.deleteQuiz(quiz_id);
    } catch (error) {
      console.error('Error deleting quiz:', error);
      throw error;
    }
  }
}
