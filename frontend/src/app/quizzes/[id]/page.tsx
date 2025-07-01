"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { listQuizById } from "@/services/quizzes/listQuizById";
import { BiCheckCircle } from "react-icons/bi";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Question {
  id: string;
  type: "boolean" | "input" | "checkbox";
  content: string;
  options?: string[];
  correctAnswers?: string[];
}

interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  createdAt?: string;
}

export default function QuizDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchQuiz(params.id as string);
    }
  }, [params.id]);

  const fetchQuiz = async (id: string) => {
    try {
      const response = await listQuizById(Number(id));
      if (response) {
        setQuiz(response);
      } else if (response.status === 404) {
        setError("Quiz not found");
      } else {
        setError("Failed to load quiz");
      }
    } catch (error) {
      console.error("Error fetching quiz:", error);
      setError("Failed to load quiz");
    } finally {
      setLoading(false);
    }
  };

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case "boolean":
        return "True/False";
      case "input":
        return "Short Answer";
      case "checkbox":
        return "Multiple Choice";
      default:
        return type;
    }
  };

  const renderQuestion = (question: Question, index: number) => {
    return (
      <Card key={question.id} className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg">Question {index + 1}</CardTitle>
            <Badge>{getQuestionTypeLabel(question.type)}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-base font-medium mb-3">{question.content}</p>
          </div>

          {question.type.toLocaleLowerCase() === "boolean" && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Options:
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full border-2 border-muted-foreground"></div>
                  <span
                    className={
                      question.correctAnswers?.includes("True")
                        ? "font-medium"
                        : ""
                    }
                  >
                    True
                    {question.correctAnswers?.includes("True") && (
                      <BiCheckCircle className="inline-block w-4 h-4 ml-2 text-green-600" />
                    )}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full border-2 border-muted-foreground"></div>
                  <span
                    className={
                      question.correctAnswers?.includes("False")
                        ? "font-medium"
                        : ""
                    }
                  >
                    False
                    {question.correctAnswers?.includes("False") && (
                      <BiCheckCircle className="inline-block w-4 h-4 ml-2 text-green-600" />
                    )}
                  </span>
                </div>
              </div>
              {question.correctAnswers &&
                question.correctAnswers.length > 0 && (
                  <p className="text-sm text-green-600 mt-2">
                    Correct answer: {question.correctAnswers[0]}
                  </p>
                )}
            </div>
          )}

          {question.type.toLocaleLowerCase() === "input" && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Answer type:
              </p>
              <div className="p-3 bg-muted rounded-md">
                <Input
                  type="text"
                  placeholder="Your answer here"
                  className="w-full"
                />
              </div>
            </div>
          )}

          {question.type.toLocaleLowerCase() === "checkbox" &&
            question.options && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Options:
                </p>
                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => {
                    const isCorrect = question.correctAnswers?.includes(option);
                    return (
                      <div
                        key={optionIndex}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox disabled />
                        <span className={isCorrect ? "font-medium" : ""}>
                          {option}
                          {isCorrect && (
                            <BiCheckCircle className="inline-block w-4 h-4 ml-2 text-green-600" />
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {question.correctAnswers &&
                  question.correctAnswers.length > 0 && (
                    <p className="text-sm text-green-600 mt-2">
                      Correct answers: {question.correctAnswers.join(", ")}
                    </p>
                  )}
              </div>
            )}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading quiz...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Quiz Not Found</h2>
            <p className="text-muted-foreground mb-6">
              {error || "The quiz you're looking for doesn't exist."}
            </p>
            <Button
              onClick={() => router.push("/quizzes")}
              style={{ cursor: "pointer" }}
            >
              Back to Quizzes
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-6">
        <Button
          onClick={() => router.push("/quizzes")}
          className="mb-4"
          style={{ cursor: "pointer" }}
        >
          Back to Quizzes
        </Button>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{quiz.title}</h1>
          <div className="flex items-center space-x-4 text-muted-foreground">
            <span>
              {quiz.questions.length}{" "}
              {quiz.questions.length === 1 ? "question" : "questions"}
            </span>
            {quiz.createdAt && (
              <span>
                Created {new Date(quiz.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Quiz Structure</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This is a read-only view of the quiz structure. Below you can see
              all questions and their correct answers.
            </p>
          </CardContent>
        </Card>

        {quiz.questions.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              This quiz has no questions.
            </CardContent>
          </Card>
        ) : (
          quiz.questions.map((question, index) =>
            renderQuestion(question, index)
          )
        )}
      </div>
    </div>
  );
}
