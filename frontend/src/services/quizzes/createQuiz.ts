import { api } from "../api";

export async function createQuiz(quiz: {
  title: string;
  questions: Array<{
    id: string;
    type: string;
    question: string;
    options?: string[];
    correctAnswers?: string[];
  }>;
}) {
  const response = await api.post("/quizzes", {
    title: quiz.title,
    questions: quiz.questions.map((question) => ({
      type: question.type,
      content: question.question,
      options: question.options || [],
      correctAnswers: question.correctAnswers || [],
    })),
  });

  return response.data;
}
