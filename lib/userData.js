import { getToken } from "./authenticate";

async function fetchData(endpoint, method) {
  const token = getToken();
  if (!token) return [];

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
      method,
      headers: {
        Authorization: `JWT ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (res.status === 200) {
      return await res.json();
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  return [];
}

export async function addToFavourite(id) {
  return await fetchData(`/favourites/${id}`, "PUT");
}

export async function removeFromFavourite(id) {
  return await fetchData(`/favourites/${id}`, "DELETE");
}

export async function getFavourites() {
  return await fetchData(`/favourites`, "GET");
}

export async function addToHistory(id) {
  return await fetchData(`/history/${id}`, "PUT");
}

export async function removeFromHistory(id) {
  return await fetchData(`/history/${id}`, "DELETE");
}

export async function getHistory() {
  return await fetchData(`/history`, "GET");
}
