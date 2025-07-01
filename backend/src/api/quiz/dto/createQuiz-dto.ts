import { IsNotEmpty, IsString } from 'class-validator';

export class CreateQuizDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  questions: {
    type: string;
    content: string;
    options?: string[];
    correctAnswers?: string[];
  }[];
}
