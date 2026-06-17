import { NextResponse } from "next/server";
import { searchMovies } from "../../../lib/tmdb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") ?? "";

  try {
    const movies = await searchMovies(query);

    return NextResponse.json({
      results: movies,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "映画データの取得に失敗しました",
      },
      {
        status: 500,
      }
    );
  }
}