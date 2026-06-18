import { NextResponse } from "next/server";
import { getTrendingMovies } from "../../../lib/tmdb";

export async function GET() {
  try {
    const movies = await getTrendingMovies();

    return NextResponse.json({
      results: movies,
    });
  } catch {
    return NextResponse.json(
      { error: "話題作の取得に失敗しました" },
      { status: 500 }
    );
  }
}