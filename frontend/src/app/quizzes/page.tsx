"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaRegTrashAlt } from "react-icons/fa";
import { listQuizzes } from "@/services/quizzes/listQuizzes";
import { deleteQuizService } from "@/services/quizzes/deleteQuiz";

interface Quiz {
  id: string;
  title: string;
  questions: Array<{
    id: string;
    type: string;
    question: string;
  }>;
  createdAt?: string;
}

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await listQuizzes();
      if (response) {
        setQuizzes(response);
      } else {
        console.error("Failed to fetch quizzes");
      }
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteQuiz = async (id: string) => {
    setDeletingId(id);
    try {
      const response = await deleteQuizService(Number(id));

      if (response) {
        setQuizzes((prev) => prev.filter((quiz) => quiz.id !== id));
      } else {
        alert("Failed to delete quiz");
      }
    } catch (error) {
      console.error("Error deleting quiz:", error);
      alert("Failed to delete quiz");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading quizzes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Quizzes</h1>
          <p className="text-muted-foreground mt-2">
            Manage and view all your created quizzes
          </p>
        </div>
        <Link href="/create">
          <Button>Create Quiz</Button>
        </Link>
      </div>

      {quizzes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="flex flex-col items-center max-w-md mx-auto">
              <h3 className="text-lg font-semibold mb-2">No quizzes yet</h3>
              <p className="text-muted-foreground mb-6">
                Get started by creating your first quiz. You can add different
                types of questions and share them with others.
              </p>
              <Link href="/create">
                <Button>Create Your First Quiz</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-2">
                    {quiz.title}
                  </CardTitle>
                  <FaRegTrashAlt
                    style={{
                      cursor:
                        deletingId !== quiz.id ? "pointer" : "not-allowed",
                    }}
                    onClick={() =>
                      deletingId !== quiz.id && deleteQuiz(quiz.id)
                    }
                  />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    {quiz.questions.length}{" "}
                    {quiz.questions.length === 1 ? "question" : "questions"}
                  </div>

                  {quiz.createdAt && (
                    <div className="text-xs text-muted-foreground">
                      Created {new Date(quiz.createdAt).toLocaleDateString()}
                    </div>
                  )}

                  <Link href={`/quizzes/${quiz.id}`} className="block">
                    <Button className="w-full bg-transparent">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
