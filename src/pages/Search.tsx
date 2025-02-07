import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import DogCard, { Dog } from "../components/DogCard";
import { fetchBreeds, fetchDogs, fetchMatch } from "../api/Dog";

const Search: React.FC = () => {
  const { logout } = useAuth();
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreed, setSelectedBreed] = useState<string>("");
  const [page, setPage] = useState(0);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);

  useEffect(() => {
    fetchBreeds().then(setBreeds);
    fetchDogs(selectedBreed, page, sortOrder).then(setDogs);
  }, [selectedBreed, page, sortOrder]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const handleMatch = async () => {
    if (favorites.length === 0) return;
    const matched = await fetchMatch(favorites);
    setMatchedDog(matched);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-end">
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded"
          onClick={logout}
        >
          Logout
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-4">Search for Dogs</h2>
      <div className="flex items-center gap-4 my-4">
        <select
          className="border p-2 rounded"
          onChange={(e) => setSelectedBreed(e.target.value)}
        >
          <option value="">All Breeds</option>
          {breeds.map((breed) => (
            <option key={breed} value={breed}>
              {breed}
            </option>
          ))}
        </select>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        >
          Sort: {sortOrder.toUpperCase()}
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {dogs.map((dog) => (
          <DogCard
            key={dog.id}
            dog={dog}
            isFavorite={favorites.includes(dog.id)}
            toggleFavorite={toggleFavorite}
          />
        ))}
      </div>
      <div className="flex justify-between mt-4">
        <button
          className="bg-gray-500 px-4 py-2 rounded"
          onClick={() => setPage(page - 1)}
          disabled={page === 0}
        >
          Previous
        </button>
        <button
          className="bg-gray-500 px-4 py-2 rounded"
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
      {favorites.length > 0 && (
        <div className="mt-6 text-center">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={handleMatch}
          >
            Find My Match
          </button>
        </div>
      )}
      {matchedDog && (
        <div className="mt-6 p-4 border rounded bg-gray-100 text-center max-w-xs mx-auto">
          <h3 className="text-xl font-semibold mb-4">Your Best Match:</h3>
          <DogCard
            dog={matchedDog}
            isFavorite={false}
            toggleFavorite={() => {}}
          />
        </div>
      )}
    </div>
  );
};

export default Search;
