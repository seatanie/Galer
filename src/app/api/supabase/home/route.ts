import { NextResponse } from "next/server";
import { fetchHomeFromSupabase } from "@/lib/supabase/fetch-home";

export async function GET() {
  const data = await fetchHomeFromSupabase();
  return NextResponse.json(data);
}
