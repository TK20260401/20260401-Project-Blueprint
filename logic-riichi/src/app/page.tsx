import { GameContainer } from "@/components/GameContainer";
import { QRCodeSection } from "@/components/QRCodeSection";
import AuthButton from "@/components/AuthButton";
import VisitorCounter from "@/components/VisitorCounter";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-6 sm:py-8 px-3 sm:px-4">
      <header className="mb-6 sm:mb-8">
        {/* ログインボタン + 訪問者数（右上） */}
        <div className="flex items-center justify-end gap-3 max-w-3xl mx-auto mb-3">
          <VisitorCounter />
          <AuthButton />
        </div>
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">LogicRiichi</h1>
          <p className="text-white text-sm">
            <ruby>麻雀<rp>(</rp><rt>マージャン</rt><rp>)</rp></ruby>の<ruby>待<rp>(</rp><rt>ま</rt><rp>)</rp></ruby>ち<ruby>牌<rp>(</rp><rt>はい</rt><rp>)</rp></ruby>を<ruby>当<rp>(</rp><rt>あ</rt><rp>)</rp></ruby>てて、アルゴリズム<ruby>的<rp>(</rp><rt>てき</rt><rp>)</rp></ruby><ruby>思考<rp>(</rp><rt>しこう</rt><rp>)</rp></ruby>を<ruby>鍛<rp>(</rp><rt>きた</rt><rp>)</rp></ruby>えよう
          </p>
        </div>
      </header>

      {/* aboutページへのリンク */}
      <div className="max-w-3xl mx-auto mb-6 text-center">
        <a
          href="/about"
          className="inline-block text-white text-sm underline underline-offset-4 hover:text-white transition-colors"
        >
          なぜ「<ruby>待<rp>(</rp><rt>ま</rt><rp>)</rp></ruby>ち<ruby>牌<rp>(</rp><rt>はい</rt><rp>)</rp></ruby><ruby>当<rp>(</rp><rt>あ</rt><rp>)</rp></ruby>て」でアルゴリズム<ruby>的<rp>(</rp><rt>てき</rt><rp>)</rp></ruby><ruby>思考<rp>(</rp><rt>しこう</rt><rp>)</rp></ruby>が<ruby>身<rp>(</rp><rt>み</rt><rp>)</rp></ruby>につくのか？ →
        </a>
      </div>
      <GameContainer />
      <QRCodeSection />
    </div>
  );
}
