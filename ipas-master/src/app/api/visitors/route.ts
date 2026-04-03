import { createServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = createServerClient();
  const { data, error } = await supabase.rpc("increment_visitor");
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  const row = data?.[0] ?? { today_count: 0, total_count: 0 };
  return NextResponse.json({ today: row.today_count, total: row.total_count });
}

export async function GET() {
  const supabase = createServerClient();
  const today = new Date().toISOString().slice(0, 10);

  const [todayRes, totalRes] = await Promise.all([
    supabase.from("visitor_counts").select("count").eq("visit_date", today).single(),
    supabase.from("visitor_counts").select("count"),
  ]);

  const todayCount = todayRes.data?.count ?? 0;
  const totalCount = totalRes.data?.reduce((sum: number, r: { count: number }) => sum + r.count, 0) ?? 0;

  return NextResponse.json({ today: todayCount, total: totalCount });
}
