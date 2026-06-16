import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { MovieList } from "../components/MovieList";
import { MovieCard } from "../components/MovieCard";


export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Header />
      <section className="mx-auto flex max-w-6xl flex-col px-6 py-20">
        <Hero />
        <MovieList />
      </section>
    </main>
  );
}