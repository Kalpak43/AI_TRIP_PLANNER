import SearchBar from "@/components/SearchBar";
import Recommendations from "@/components/Recommendations";

function HomePage() {
  return (
    <main className="space-y-4">
      <SearchBar />
      <Recommendations />
    </main>
  );
}

export default HomePage;
