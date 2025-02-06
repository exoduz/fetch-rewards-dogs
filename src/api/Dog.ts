export const fetchBreeds = async (): Promise<string[]> => {
  const response = await fetch(
    "https://frontend-take-home-service.fetch.com/dogs/breeds",
    {
      credentials: "include",
    }
  );
  const data = await response.json();
  return data;
};

export const fetchDogs = async (
  selectedBreed: string,
  page: number,
  sortOrder: "asc" | "desc"
): Promise<any[]> => {
  const queryParams = new URLSearchParams({
    size: "10",
    from: (page * 10).toString(),
    sort: `breed:${sortOrder}`,
  });
  if (selectedBreed) queryParams.append("breeds", selectedBreed);

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
    const dogData = await dogResponse.json();
    return dogData;
  }

  return [];
};
