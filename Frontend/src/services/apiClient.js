import { tryRefreshToken } from "./authRefresh";

export async function apiFetch(domain, path = "", options = {}) {
  const url = path ? `${domain}/${path}` : domain;

  const res = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (res.status === 401) {
    console.warn("Unauthorized - trying refresh...");

    await tryRefreshToken();

    const retryRes = await fetch(url, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    if (!retryRes.ok) {
      throw new Error("Request failed after refresh");
    }

    const retryData = await retryRes.json();
    return retryData.data;
  }

  const data = await res.json();

  if (!data.succeeded) {
    throw new Error(data.message || "API Error");
  }

  return data.data !== undefined ? data.data : data;
}
