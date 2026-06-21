import { NextResponse } from "next/server";
import { discoverMoviesByGenre } from "../../../lib/tmdb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const genreId = searchParams.get("genreId") ?? "";
  const page = searchParams.get("page") ?? "1";

  if (!genreId) {
    return NextResponse.json(
      {
        error: "genreId is required",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const movies = await discoverMoviesByGenre(genreId, page);

    return NextResponse.json(movies);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "ジャンル別映画の取得に失敗しました",
      },
      {
        status: 500,
      }
    );
  }
}