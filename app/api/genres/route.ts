import { NextResponse } from "next/server";
import { getMovieGenres } from "../../../lib/tmdb";

export async function GET() {
  try {
    const genres = await getMovieGenres();

    return NextResponse.json({
      genres,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "ジャンル一覧の取得に失敗しました",
      },
      {
        status: 500,
      }
    );
  }
}