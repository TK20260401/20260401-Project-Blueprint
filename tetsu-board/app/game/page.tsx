import { GameBoard } from "@/components/GameBoard";

export default function GamePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#fbf6ec] py-6">
      <h1 className="mb-2 text-xl font-black text-stone-700">てつぼーど（試作）</h1>
      <GameBoard />
    </main>
  );
}
