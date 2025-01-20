import { QueryClient } from "@tanstack/react-query";

import { API_KEY } from "./constants";

// const baseUrl = `${baseUrl}`; // Removed due to circular reference

export const queryClient = new QueryClient();

export async function fetchFn({ queryKey }: { queryKey: [string, string] }) {
  const [url] = queryKey;

  try {
    const response = await fetch(`${url}`, {
      headers: {
        "Content-Type": "application/json",
        "X-Noroff-API-Key": API_KEY,
      },
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "An error occurred.");
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to fetch data.");
    } else {
      throw new Error("Failed to fetch data.");
    }
  }
}

export async function postFn({
  url,
  body,
  token,
}: {
  url: string;
  body: Record<string, unknown>;
  token: string;
}) {
  try {
    const response = await fetch(`$${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Noroff-API-Key": API_KEY,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "An error occurred.");
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to post data.");
    } else {
      throw new Error("Failed to post data.");
    }
  }
}

export async function putFn({
  url,
  body,
  token,
}: {
  url: string;
  body: Record<string, unknown>;
  token: string;
}) {
  try {
    const response = await fetch(`${url}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Noroff-API-Key": API_KEY,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "An error occurred while editing.");
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to edit data.");
    } else {
      throw new Error("Failed to edit data.");
    }
  }
}

export async function deleteFn({ url, token }: { url: string; token: string }) {
  try {
    const response = await fetch(`${url}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-Noroff-API-Key": API_KEY,
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "An error occurred while deleting.");
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to delete data.");
    } else {
      throw new Error("Failed to delete data.");
    }
  }
}
