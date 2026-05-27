// 共通コンポーネント RubyText（DESIGN 16 共通7種の1つ / 全漢字ルビ方針 7.x）。
// Web の <ruby> を用いる。showRuby でルビ表示を切替（アクセシビリティ設定と連動予定）。

import type { RubyText as RubyTextData } from "@/lib/game/types";

type Props = {
  text: RubyTextData;
  showRuby?: boolean;
  className?: string;
};

export function RubyText({ text, showRuby = true, className }: Props) {
  if (!showRuby || !text.ruby) {
    return <span className={className}>{text.base}</span>;
  }
  return (
    <ruby className={className}>
      {text.base}
      <rp>(</rp>
      <rt className="text-[0.55em] font-normal tracking-tight">{text.ruby}</rt>
      <rp>)</rp>
    </ruby>
  );
}
