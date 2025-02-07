import type { Dog } from "../components/DogCard";

export type DogSearchResult = {
  dogs: Dog[];
  total: number;
  next: string | null;
  prev: string | null;
};

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
  subsequentPage: string | null,
  sortOrder: "asc" | "desc"
): Promise<DogSearchResult> => {
  const baseUrl = "https://frontend-take-home-service.fetch.com";
  let url = "";

  if (subsequentPage) {
    url = `${baseUrl}${subsequentPage}`;
  } else {
    const queryParams = new URLSearchParams({
      size: "10",
      from: "0",
      sort: selectedBreed ? `name:${sortOrder}` : `breed:${sortOrder}`,
    });

    if (selectedBreed) {
      queryParams.set("breeds", selectedBreed);
    }

    url = `${baseUrl}/dogs/search?${queryParams}`;
  }

  const response = await fetch(url, {
    credentials: "include",
  });

  const { resultIds, total, next, prev } = await response.json();
  const dogs = resultIds.length ? await fetchDogDetails(resultIds) : [];
  return { dogs, total, next, prev };
};

const fetchDogDetails = async (dogIds: string[]): Promise<Dog[]> => {
  const response = await fetch(
    "https://frontend-take-home-service.fetch.com/dogs",
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dogIds),
    }
  );
  return response.json();
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
