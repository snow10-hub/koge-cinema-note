const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export type TmdbMovie = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  overview: string;
  backdrop_path: string | null;
};

// 🌟 修正：引数に page を追加し、戻り値を results と total_pages のオブジェクトにする
export async function searchMovies(
  query: string, 
  page: string = "1"
): Promise<{ results: TmdbMovie[]; total_pages: number }> {
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    throw new Error("TMDB_API_KEY is not set");
  }

  if (!query.trim()) {
    return { results: [], total_pages: 0 };
  }

  const params = new URLSearchParams({
    api_key: apiKey,
    query,
    language: "ja-JP",
    include_adult: "false",
    page, // 🌟 追加：TMDBにページ番号を渡す！
  });

  const response = await fetch(`${TMDB_BASE_URL}/search/movie?${params}`);

  if (!response.ok) {
    throw new Error("Failed to fetch movies");
  }

  const data = await response.json();

  // 🌟 修正：映画のリストだけでなく、TMDBから返ってきた総ページ数も一緒に返す
  return {
    results: data.results,
    total_pages: data.total_pages ?? 1,
  };
}


export async function getTrendingMovies(): Promise<TmdbMovie[]> {
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    throw new Error("TMDB_API_KEY is not set");
  }

  const params = new URLSearchParams({
    api_key: apiKey,
    language: "ja-JP",
  });

  const response = await fetch(`${TMDB_BASE_URL}/trending/movie/week?${params}`);

  if (!response.ok) {
    throw new Error("Failed to fetch trending movies");
  }

  const data = await response.json();

  return data.results;
}

export type TmdbMovieDetail = {
  id: number;
  title: string;
  tagline: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  runtime: number | null;
  vote_average: number;
  genres: {
    id: number;
    name: string;
  }[];
};

export async function getMovieDetails(id: string): Promise<TmdbMovieDetail> {
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    throw new Error("TMDB_API_KEY is not set");
  }

  const params = new URLSearchParams({
    api_key: apiKey,
    language: "ja-JP",
  });

  const response = await fetch(`${TMDB_BASE_URL}/movie/${id}?${params}`);

  if (!response.ok) {
    throw new Error("Failed to fetch movie details");
  }

  return response.json();
}