import { QueryClient } from "@tanstack/react-query";
import { loadLocal } from "./localStorage";
import { API_KEY } from "./constants";

export const queryClient = new QueryClient();

/**
 * Fetches data from the provided URL.
 *
 * @param {Object} params - Parameters for the fetch function.
 * @param {[string, string]} params.queryKey - The query key containing the URL and method.
 * @returns {Promise<any>} A promise that resolves to the fetched data.
 * @throws {Error} Throws an error if the fetch operation fails.
 */
export async function fetchFn({ queryKey }: { queryKey: [string, string] }) {
  const [url] = queryKey;
  const token = loadLocal("token");

  try {
    const response = await fetch(`${url}`, {
      headers: {
        "Content-Type": "application/json",
        "X-Noroff-API-Key": API_KEY,
        Authorization: token ? `Bearer ${token}` : "",
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

/**
 * Sends a POST request to the specified URL.
 *
 * @param {Object} params - Parameters for the POST request.
 * @param {string} params.url - The API endpoint URL.
 * @param {Record<string, unknown>} params.body - The request payload.
 * @param {string} params.token - The authentication token.
 * @returns {Promise<any>} A promise that resolves to the response data.
 * @throws {Error} Throws an error if the request fails.
 */
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
    const response = await fetch(`${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Noroff-API-Key": API_KEY,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("POST Error:", error);
    throw error;
  }
}

/**
 * Sends a PUT request to update data at the specified URL.
 *
 * @param {Object} params - Parameters for the PUT request.
 * @param {string} params.url - The API endpoint URL.
 * @param {Record<string, unknown>} params.body - The request payload.
 * @param {string} params.token - The authentication token.
 * @returns {Promise<any>} A promise that resolves to the response data.
 * @throws {Error} Throws an error if the request fails.
 */
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

/**
 * Sends a DELETE request to the specified URL.
 *
 * @param {Object} params - Parameters for the DELETE request.
 * @param {string} params.url - The API endpoint URL.
 * @param {string} params.token - The authentication token.
 * @returns {Promise<any | null>} A promise that resolves to the response data or null if successful.
 * @throws {Error} Throws an error if the request fails.
 */
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

    if (response.status === 204) {
      return null;
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to delete data.");
    } else {
      throw new Error("Failed to delete data.");
    }
  }
}
