import type { Dog } from "../components/DogCard";

export const fetchBreeds = async (): Promise<string[]> => {
  const response = await fetch(
    "https://frontend-take-home-service.fetch.com/dogs/breeds",
    {
      credentials: "include",
    }
  );
  return response.json();
};

export const fetchDogs = async (
  selectedBreed: string,
  page: number,
  sortOrder: "asc" | "desc"
): Promise<Dog[]> => {
  const queryParams = new URLSearchParams({
    size: "10",
    from: (page * 10).toString(),
  });

  if (selectedBreed) {
    queryParams.set("breeds", selectedBreed);
    queryParams.set("sort", `name:${sortOrder}`); // Sort by name when a breed is selected
  } else {
    queryParams.set("sort", `breed:${sortOrder}`); // Sort by breed first, then name
  }

  const response = await fetch(
    `https://frontend-take-home-service.fetch.com/dogs/search?${queryParams}`,
    {
      credentials: "include",
    }
  );

  const { resultIds } = await response.json();

  if (resultIds.length) {
    const dogResponse = await fetch(
      "https://frontend-take-home-service.fetch.com/dogs",
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resultIds),
      }
    );
    return dogResponse.json();
  }

  return [];
};

export const fetchMatch = async (
  favoriteIds: string[]
): Promise<Dog | null> => {
  if (favoriteIds.length === 0) return null;

  const response = await fetch(
    "https://frontend-take-home-service.fetch.com/dogs/match",
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(favoriteIds),
    }
  );

  const { match } = await response.json();

  if (match) {
    const dogResponse = await fetch(
      "https://frontend-take-home-service.fetch.com/dogs",
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([match]),
      }
    );

    const matchedDog = await dogResponse.json();

    return matchedDog[0] || null;
  }

  return null;
};
