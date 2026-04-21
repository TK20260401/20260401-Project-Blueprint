"use client";

import { useState } from "react";

type Topic = {
  id: string;
  name: string;
  slug: string;
};

type Question = {
  id: string;
  body: string;
  choices: string[];
  correct_index: number;
  explanation: string | null;
  difficulty: number;
};

type Props = {
  topic: Topic;
  questions: Question[];
};

export default function QuizClient({ topic, questions }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [showResult, setShowResult] = useState(false);

  const question = questions[currentIndex];
  const isAnswered = selectedIndex !== null;
  const isCorrect = selectedIndex === question?.correct_index;
  const isFinished = showResult;

  const handleSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedIndex(index);
    setAnswers((prev) => [...prev, index === question.correct_index]);
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedIndex(null);
    } else {
      setShowResult(true);
    }
  };

  if (isFinished) {
    const correctCount = answers.filter(Boolean).length;
    const total = questions.length;
    const percentage = Math.round((correctCount / total) * 100);

    return (
      <div className="max-w-lg mx-auto px-4 py-6 text-center">
        <h1 className="text-2xl font-bold mb-2">{topic.name}</h1>
        <p className="text-gray-500 mb-8">結果発表</p>

        <div className="text-6xl font-bold text-blue-600 mb-2">
          {percentage}%
        </div>
        <p className="text-lg text-gray-700 mb-8">
          {total}問中 {correctCount}問正解
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => {
              setCurrentIndex(0);
              setSelectedIndex(null);
              setAnswers([]);
              setShowResult(false);
            }}
            className="rounded-xl bg-blue-600 text-white py-3 px-6 font-medium active:scale-[0.98] transition-transform"
          >
            もう一度チャレンジ
          </button>
          <a
            href="/"
            className="rounded-xl border border-gray-300 py-3 px-6 font-medium text-gray-700 active:scale-[0.98] transition-transform"
          >
            トップにもどる
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold">{topic.name}</h1>
        <span className="text-sm text-gray-500">
          {currentIndex + 1} / {questions.length}
        </span>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm mb-4">
        <p className="text-base leading-relaxed whitespace-pre-wrap">
          {question.body}
        </p>
      </div>

      <div className="grid gap-3 mb-4">
        {question.choices.map((choice, i) => {
          let style = "border-gray-200 bg-white";
          if (isAnswered) {
            if (i === question.correct_index) {
              style = "border-green-500 bg-green-50 text-green-900";
            } else if (i === selectedIndex) {
              style = "border-red-400 bg-red-50 text-red-900";
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={isAnswered}
              className={`w-full text-left rounded-xl border p-4 transition-colors ${style} ${
                !isAnswered ? "active:scale-[0.98]" : ""
              }`}
            >
              <span className="font-medium mr-2">
                {String.fromCharCode(65 + i)}.
              </span>
              {choice}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className="mb-4">
          <div
            className={`rounded-xl p-4 text-sm ${
              isCorrect
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            <p className="font-bold mb-1">
              {isCorrect ? "正解！" : "不正解..."}
            </p>
            {question.explanation && (
              <p className="leading-relaxed">{question.explanation}</p>
            )}
          </div>

          <button
            onClick={handleNext}
            className="mt-4 w-full rounded-xl bg-blue-600 text-white py-3 font-medium active:scale-[0.98] transition-transform"
          >
            {currentIndex + 1 < questions.length
              ? "次の問題へ"
              : "結果を見る"}
          </button>
        </div>
      )}
    </div>
  );
}
