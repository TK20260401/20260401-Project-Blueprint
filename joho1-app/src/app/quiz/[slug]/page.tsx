import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import QuizClient from "./quiz-client";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function QuizPage({ params }: Props) {
  const { slug } = await params;

  const { data: topic } = await supabase
    .from("topics")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!topic) notFound();

  const { data: questions } = await supabase
    .from("questions")
    .select("*")
    .eq("topic_id", topic.id)
    .order("created_at");

  if (!questions || questions.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-6 text-center">
        <h1 className="text-2xl font-bold mb-4">{topic.name}</h1>
        <p className="text-gray-500">この単元の問題はまだ準備中です</p>
        <a
          href="/"
          className="inline-block mt-6 text-blue-600 font-medium"
        >
          トップにもどる
        </a>
      </div>
    );
  }

  return <QuizClient topic={topic} questions={questions} />;
}
