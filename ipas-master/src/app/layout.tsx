import type { Metadata, Viewport } from "next";
import SessionProvider from "@/components/SessionProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "IPAS-Master",
  description:
    "ITパスポート試験対策アプリ - 500問ドリル・計算シミュレーター・用語フラッシュ・2進数変換で楽しく学習",
  appleWebApp: {
    capable: true,
    title: "IPAS-Master",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#059669",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <a href="#main-content" className="skip-link">
          メインコンテンツへスキップ
        </a>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
