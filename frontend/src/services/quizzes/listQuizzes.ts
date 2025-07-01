import { api } from "../api";

export async function listQuizzes() {
  const response = await api.get("/quizzes");

  return response.data;
}
