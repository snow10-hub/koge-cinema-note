const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export type TmdbMovie = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  overview: string;
};

export async function searchMovies(query: string): Promise<TmdbMovie[]> {
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    throw new Error("TMDB_API_KEY is not set");
  }

  if (!query.trim()) {
    return [];
  }

  const params = new URLSearchParams({
    api_key: apiKey,
    query,
    language: "ja-JP",
    include_adult: "false",
  });

  const response = await fetch(`${TMDB_BASE_URL}/search/movie?${params}`);

  if (!response.ok) {
    throw new Error("Failed to fetch movies");
  }

  const data = await response.json();

  return data.results;
}