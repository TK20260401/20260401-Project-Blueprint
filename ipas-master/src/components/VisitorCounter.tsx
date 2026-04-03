"use client";

import { useState, useEffect } from "react";

export default function VisitorCounter() {
  const [counts, setCounts] = useState<{ today: number; total: number } | null>(null);

  useEffect(() => {
    fetch("/api/visitors", { method: "POST" })
      .then((res) => res.json())
      .then((data) => setCounts(data))
      .catch(() => {});
  }, []);

  if (!counts) return null;

  return (
    <div className="flex items-center gap-2 text-xs text-emerald-100">
      <span className="bg-white/15 rounded-lg px-2 py-1">
        本日: <strong className="text-white">{counts.today}</strong>
      </span>
      <span className="bg-white/15 rounded-lg px-2 py-1">
        累計: <strong className="text-white">{counts.total}</strong>
      </span>
    </div>
  );
}
