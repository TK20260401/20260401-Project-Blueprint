import GameContainer from "@/components/GameContainer";
import QRCodeBlock from "@/components/QRCodeBlock";
import AuthButton from "@/components/AuthButton";
import VisitorCounter from "@/components/VisitorCounter";

const PROD_URL = "https://ipas-master.vercel.app";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 min-h-screen bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700">
      <header className="py-6 sm:py-8 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              IPAS-Master
            </h1>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <VisitorCounter />
            <AuthButton />
          </div>
        </div>
        <p className="mt-2 text-base sm:text-lg text-emerald-100 text-center">
          IT<ruby>パスポート<rp>(</rp><rt>ぱすぽーと</rt><rp>)</rp></ruby>
          <ruby>試験<rp>(</rp><rt>しけん</rt><rp>)</rp></ruby>
          <ruby>対策<rp>(</rp><rt>たいさく</rt><rp>)</rp></ruby>アプリ
          <span className="ml-2 inline-block bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            500<ruby>問<rp>(</rp><rt>もん</rt><rp>)</rp></ruby>
          </span>
        </p>
      </header>

      <main
        id="main-content"
        className="flex-1 w-full max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 pb-8"
      >
        <GameContainer />
      </main>

      <footer className="safe-bottom bg-emerald-800/30 backdrop-blur-sm py-6 px-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-sm text-emerald-200 opacity-75">
              &copy; 2026 IPAS-Master
            </p>
            <p className="text-xs text-emerald-300/60 mt-1">
              ITパスポート試験 シラバスVer.6.5対応
            </p>
          </div>
          <QRCodeBlock url={PROD_URL} />
        </div>
      </footer>
    </div>
  );
}
