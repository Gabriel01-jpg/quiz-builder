import { api } from "../api";

export async function deleteQuizService(quiz_id: number) {
  const response = await api.delete(`/quizzes/${quiz_id}`);

  return response.data;
}
