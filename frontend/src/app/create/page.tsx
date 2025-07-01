"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { createQuiz } from "@/services/quizzes/createQuiz";

type QuestionType = "boolean" | "input" | "checkbox";

interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswers?: string[];
}

interface Quiz {
  title: string;
  questions: Question[];
}

export default function CreateQuizPage() {
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz>({
    title: "",
    questions: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: "boolean",
      question: "",
      options: [],
      correctAnswers: [],
    };
    setQuiz((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
  };

  const removeQuestion = (questionId: string) => {
    setQuiz((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== questionId),
    }));
  };

  const updateQuestion = (questionId: string, updates: Partial<Question>) => {
    setQuiz((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId ? { ...q, ...updates } : q
      ),
    }));
  };

  const addOption = (questionId: string) => {
    const question = quiz.questions.find((q) => q.id === questionId);
    if (question) {
      updateQuestion(questionId, {
        options: [...(question.options || []), ""],
      });
    }
  };

  const updateOption = (
    questionId: string,
    optionIndex: number,
    value: string
  ) => {
    const question = quiz.questions.find((q) => q.id === questionId);
    if (question && question.options) {
      const newOptions = [...question.options];
      newOptions[optionIndex] = value;
      updateQuestion(questionId, { options: newOptions });
    }
  };

  const removeOption = (questionId: string, optionIndex: number) => {
    const question = quiz.questions.find((q) => q.id === questionId);
    if (question && question.options) {
      const newOptions = question.options.filter(
        (_, index) => index !== optionIndex
      );
      updateQuestion(questionId, { options: newOptions });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quiz.title.trim() || quiz.questions.length === 0) {
      alert("Please provide a title and at least one question");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createQuiz({
        title: quiz.title,
        questions: quiz.questions.map((q) => ({
          id: q.id,
          type: q.type,
          question: q.question,
          options: q.options || [],
          correctAnswers: q.correctAnswers || [],
        })),
      });
      if (response) {
        router.push("/quizzes");
      } else {
        alert("Failed to create quiz");
      }
    } catch (error) {
      console.error("Error creating quiz:", error);
      alert("Failed to create quiz");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestionForm = (question: Question, index: number) => {
    return (
      <Card key={question.id} className="mb-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg">Question {index + 1}</CardTitle>
          <Button type="button" onClick={() => removeQuestion(question.id)}>
            Remove
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor={`question-${question.id}`}>Question</Label>
            <Textarea
              id={`question-${question.id}`}
              value={question.question}
              onChange={(e) =>
                updateQuestion(question.id, { question: e.target.value })
              }
              placeholder="Enter your question"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor={`type-${question.id}`}>Question Type</Label>
            <Select
              id={`type-${question.id}`}
              value={question.type}
              onValueChange={(value) =>
                updateQuestion(question.id, { type: value as QuestionType })
              }
              options={[
                { value: "boolean", label: "True/False" },
                { value: "input", label: "Input" },
                { value: "checkbox", label: "Multiple Choice" },
              ]}
            />
          </div>

          {question.type === "boolean" && (
            <div>
              <Label>Correct Answer</Label>
              <RadioGroup>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="True"
                    id={`true-${question.id}`}
                    onCheckedChange={(value) =>
                      updateQuestion(question.id, { correctAnswers: [value] })
                    }
                    name="boolean-option"
                  />
                  <Label htmlFor={`true-${question.id}`}>True</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="False"
                    id={`false-${question.id}`}
                    onCheckedChange={(value) =>
                      updateQuestion(question.id, { correctAnswers: [value] })
                    }
                    name="boolean-option"
                  />
                  <Label htmlFor={`false-${question.id}`}>False</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {question.type === "checkbox" && (
            <div>
              <div className="flex items-center justify-between">
                <Label>Options</Label>
                <Button type="button" onClick={() => addOption(question.id)}>
                  Add Option
                </Button>
              </div>
              <div className="space-y-2 mt-2">
                {question.options?.map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      checked={
                        question.correctAnswers?.includes(option) || false
                      }
                      onCheckedChange={(checked) => {
                        const currentAnswers = question.correctAnswers || [];
                        if (checked) {
                          updateQuestion(question.id, {
                            correctAnswers: [...currentAnswers, option],
                          });
                        } else {
                          updateQuestion(question.id, {
                            correctAnswers: currentAnswers.filter(
                              (a) => a !== option
                            ),
                          });
                        }
                      }}
                    />
                    <Input
                      onChangeValue={(e) =>
                        updateOption(question.id, optionIndex, e)
                      }
                      id={`option-${question.id}-${optionIndex}`}
                      value={option}
                      placeholder={`Option ${optionIndex + 1}`}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={() => removeOption(question.id, optionIndex)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Quiz</h1>
        <p className="text-muted-foreground mt-2">
          Create a new quiz with multiple question types
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Quiz Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="title">Quiz Title</Label>
              <Input
                id="title"
                value={quiz.title}
                onChangeValue={(value: string) =>
                  setQuiz((prev) => ({ ...prev, title: value }))
                }
                placeholder="Enter quiz title"
                className="mt-1"
                required
              />
            </div>
          </CardContent>
        </Card>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Questions</h2>
            <Button type="button" onClick={addQuestion}>
              Add Question
            </Button>
          </div>

          {quiz.questions.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No questions added yet. Click &quot;Add Question&quot; to get
                started.
              </CardContent>
            </Card>
          ) : (
            quiz.questions.map((question, index) =>
              renderQuestionForm(question, index)
            )
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" onClick={() => router.push("/quizzes")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Quiz"}
          </Button>
        </div>
      </form>
    </div>
  );
}
