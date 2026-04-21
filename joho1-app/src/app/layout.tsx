import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "情報I 学習アプリ",
  description: "共通テスト「情報I」対策のスマホ完結型学習アプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900">
        <header className="bg-blue-600 text-white px-4 py-3">
          <a href="/" className="text-lg font-bold">
            情報I 学習アプリ
          </a>
        </header>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
