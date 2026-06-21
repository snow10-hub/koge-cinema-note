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

const genreNameMap: Record<string, string> = {
  History: "歴史",
  Western: "西部劇",
  Mystery: "ミステリー",
  "Science Fiction": "SF",
  "TV Movie": "TV映画",

  履歴: "歴史",
  西洋: "西部劇",
  謎: "ミステリー",
  サイエンスフィクション: "SF",
  テレビ映画: "TV映画",
};

function formatGenreName(name: string): string {
  return genreNameMap[name] ?? name;
}

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
    page,
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

  const data = await response.json();

  return {
    ...data,
    genres: (data.genres ?? []).map((genre: { id: number; name: string }) => ({
      ...genre,
      name: formatGenreName(genre.name),
    })),
  };
}

export async function getMovieRecommendations(
  id: string
): Promise<TmdbMovie[]> {
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    throw new Error("TMDB_API_KEY is not set");
  }

  const params = new URLSearchParams({
    api_key: apiKey,
    language: "ja-JP",
    page: "1",
  });

  const response = await fetch(
    `${TMDB_BASE_URL}/movie/${id}/recommendations?${params}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch movie recommendations");
  }

  const data = await response.json();

  return data.results ?? [];
}

export type TmdbGenre = {
  id: number;
  name: string;
};

export async function getMovieGenres(): Promise<TmdbGenre[]> {
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    throw new Error("TMDB_API_KEY is not set");
  }

  const params = new URLSearchParams({
    api_key: apiKey,
    language: "ja-JP",
  });

  const response = await fetch(`${TMDB_BASE_URL}/genre/movie/list?${params}`);

  if (!response.ok) {
    throw new Error("Failed to fetch movie genres");
  }

  const data = await response.json();

  return (data.genres ?? []).map((genre: TmdbGenre) => ({
    ...genre,
    name: formatGenreName(genre.name),
  }));
}

export async function discoverMoviesByGenre(
  genreId: string,
  page: string = "1"
): Promise<{ results: TmdbMovie[]; total_pages: number }> {
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    throw new Error("TMDB_API_KEY is not set");
  }

  const params = new URLSearchParams({
    api_key: apiKey,
    language: "ja-JP",
    include_adult: "false",
    sort_by: "popularity.desc",
    with_genres: genreId,
    page,
  });

  const response = await fetch(`${TMDB_BASE_URL}/discover/movie?${params}`);

  if (!response.ok) {
    throw new Error("Failed to discover movies by genre");
  }

  const data = await response.json();

  return {
    results: data.results ?? [],
    total_pages: data.total_pages ?? 1,
  };
}