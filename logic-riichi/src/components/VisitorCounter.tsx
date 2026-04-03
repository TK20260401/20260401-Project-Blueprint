"use client";

import { useEffect, useState } from "react";
import { recordVisit, getVisitorCounts } from "@/lib/supabase";

export default function VisitorCounter() {
  const [counts, setCounts] = useState<{ today: number; total: number } | null>(null);

  useEffect(() => {
    recordVisit();
    getVisitorCounts().then(setCounts);
  }, []);

  if (!counts) {
    return <div className="h-10 w-32 bg-white/10 rounded-lg animate-pulse" />;
  }

  return (
    <div className="flex items-center gap-2 text-xs text-white/80">
      <div className="flex items-center gap-1 bg-white/15 backdrop-blur-sm rounded-lg px-2.5 py-1.5">
        <span aria-hidden="true">👥</span>
        <span>
          <ruby>本日<rp>(</rp><rt>ほんじつ</rt><rp>)</rp></ruby>
          <span className="font-bold text-white ml-1">{counts.today}</span>
        </span>
      </div>
      <div className="flex items-center gap-1 bg-white/15 backdrop-blur-sm rounded-lg px-2.5 py-1.5">
        <span aria-hidden="true">📊</span>
        <span>
          <ruby>通算<rp>(</rp><rt>つうさん</rt><rp>)</rp></ruby>
          <span className="font-bold text-white ml-1">{counts.total}</span>
        </span>
      </div>
    </div>
  );
}
