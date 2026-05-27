import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-[#fbf6ec] p-8 text-center">
      <div>
        <h1 className="text-4xl font-black text-stone-800">てつぼーど</h1>
        <p className="mt-2 text-stone-500">
          でんしゃでまわって、クイズにこたえて、まちをそだてよう
        </p>
      </div>
      <Link
        href="/game"
        className="rounded-2xl bg-rose-500 px-10 py-5 text-2xl font-black text-white shadow-lg transition hover:bg-rose-600 active:scale-[0.97]"
      >
        ▶ あそぶ
      </Link>
      <p className="text-xs text-stone-400">
        試作版（ローカルプレイ）・DESIGN.md v2.7 準拠の構造
      </p>
    </main>
  );
}
