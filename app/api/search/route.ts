import { NextResponse } from "next/server";
import { searchMovies } from "../../../lib/tmdb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") ?? "";
  
  // 🌟 追加: フロントから送られてきた page パラメータを取得（無ければ1ページ目にする）
  const page = searchParams.get("page") ?? "1";

  try {
    // 🌟 修正: searchMoviesに関数に query だけでなく page も一緒に渡す
    const { results, total_pages } = await searchMovies(query, page);

    return NextResponse.json({
      results: results,
      total_pages: total_pages, // 🌟 フロント側に「総ページ数」を返してあげる
    });
  } catch {
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