import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import DogCard, { Dog } from "../components/DogCard";
import { fetchBreeds, fetchDogs, fetchMatch } from "../api/Dog";

const Search: React.FC = () => {
  const { logout } = useAuth();
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreed, setSelectedBreed] = useState<string>("");
  const [previousPage, setPreviousPage] = useState("");
  const [nextPage, setNextPage] = useState("");
  const [subsequentPage, setSubsequentPage] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [favoritesLoading, setFavoritesLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await fetchDogs(
          selectedBreed,
          subsequentPage,
          sortOrder
        );
        setDogs(result.dogs);
        setPreviousPage(result.prev || "");
        setNextPage(result.next || "");
      } catch (error) {
        console.error("Error fetching dogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBreeds().then(setBreeds);
    fetchData();
  }, [selectedBreed, sortOrder, subsequentPage]);

  const toggleFavorite = (id: string) => {
    if (favorites.length === 0) {
      setMatchedDog(null);
    }

    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const handleMatch = async () => {
    if (favorites.length === 0) return;
    setFavoritesLoading(true);
    try {
      const matched = await fetchMatch(favorites);
      setMatchedDog(matched);
    } catch (error) {
      console.error("Error fetching match:", error);
    } finally {
      setFavoritesLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Logout Button */}
      <div className="flex justify-end mb-4">
        <button
          className="bg-gray-300 text-black px-4 py-2 rounded"
          onClick={logout}
        >
          Logout
        </button>
      </div>

      {/* Heading, Filter, and Sort Button */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Search for Dogs</h2>
        <div className="flex items-center gap-4">
          <select
            className="border p-2 rounded"
            onChange={(e) => {
              setSelectedBreed(e.target.value);
              setSubsequentPage("");
            }}
          >
            <option value="">All Breeds</option>
            {breeds.map((breed) => (
              <option key={breed} value={breed}>
                {breed}
              </option>
            ))}
          </select>
          <button
            className="bg-gray-300 text-black px-4 py-2 rounded"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            Sort: {sortOrder.toUpperCase()}
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex gap-6">
        {/* Search Section */}
        <div className="w-2/3">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {dogs.map((dog) => (
                <DogCard
                  key={dog.id}
                  dog={dog}
                  isFavorite={favorites.includes(dog.id)}
                  toggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          )}
          <div className="flex mt-4">
            {previousPage && (
              <button
                className="bg-gray-300 px-4 py-2 rounded text-black mr-4"
                onClick={() => setSubsequentPage(previousPage)}
                disabled={loading}
              >
                Previous
              </button>
            )}
            {nextPage && (
              <button
                className="bg-gray-300 px-4 py-2 rounded text-black"
                onClick={() => setSubsequentPage(nextPage)}
                disabled={loading}
              >
                Next
              </button>
            )}
          </div>
        </div>

        {/* Match Section */}
        <div className="w-1/3 flex flex-col items-center">
          {favorites.length > 0 && (
            <button
              className="bg-blue-500 text-black px-4 py-2 rounded mb-4 flex items-center justify-center"
              onClick={handleMatch}
              disabled={loading}
            >
              {favoritesLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-blue-600 mr-2"></div>
                  Finding Match...
                </>
              ) : (
                "Find My Match"
              )}
            </button>
          )}
          {favorites.length > 0 && matchedDog && (
            <div className="p-4 border rounded bg-gray-100 text-center w-full max-w-xs">
              <h2 className="text-xl font-semibold mb-4 text-black">
                Your Best Match
              </h2>
              <DogCard
                dog={matchedDog}
                isFavorite={false}
                showFavorite={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
