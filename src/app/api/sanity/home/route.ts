import { NextResponse } from "next/server";
import { fetchHomeData } from "@/lib/sanity/fetch-home";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const preview = searchParams.get("preview") === "true";
  const data = await fetchHomeData(preview);
  return NextResponse.json(data);
}
