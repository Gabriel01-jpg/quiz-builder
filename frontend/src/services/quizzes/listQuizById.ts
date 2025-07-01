import { api } from "../api";

export async function listQuizById(id: number) {
  const response = await api.get(`/quizzes/${id}`);

  return response.data;
}
