import { FavoritesList } from "../../components/FavoritesList";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";

export default function FavoritesPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Header />
      <FavoritesList />
      <Footer />
    </main>
  );
}