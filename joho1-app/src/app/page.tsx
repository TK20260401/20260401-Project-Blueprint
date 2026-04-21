import Link from "next/link";
import { supabase } from "@/lib/supabase";

const topicIcons: Record<string, string> = {
  "problem-solving": "🔍",
  "communication-design": "🎨",
  "computer-programming": "💻",
  "network-data": "🌐",
};

export default async function Home() {
  const { data: topics } = await supabase
    .from("topics")
    .select("*")
    .order("sort_order");

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-2">単元をえらぶ</h1>
      <p className="text-gray-600 mb-6">学びたい分野をタップしてね</p>

      <div className="grid gap-4">
        {topics?.map((topic) => (
          <Link
            key={topic.id}
            href={`/quiz/${topic.slug}`}
            className="block rounded-xl border border-gray-200 bg-white p-5 shadow-sm active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">
                {topicIcons[topic.slug] ?? "📘"}
              </span>
              <div>
                <h2 className="font-bold text-lg">{topic.name}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {topic.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
