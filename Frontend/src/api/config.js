const LOCALHOST_DOMAIN = "https://localhost:";

const GATEWAY_PORT = "7265";

const BASE_URL = `${LOCALHOST_DOMAIN}${GATEWAY_PORT}`;

export const AUTH_API_URL = `${BASE_URL}/auth`;
export const PROFILE_API_URL = `${BASE_URL}/profile`;
export const WORKSHIFT_API_URL = `${BASE_URL}/workshift`;
export const BOOKING_API_URL = `${BASE_URL}/booking`;

export async function apiFetch(domain, path = "", options = {}) {
  const res = await fetch(path ? `${domain}/${path}` : domain, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  // Om accessToken gått ut
  if (res.status === 401) {
    console.warn("Unauthorized - trying refresh...");

    const refreshRes = await fetch(`${AUTH_API_URL}/refresh-token`, {
      method: "POST",
      credentials: "include",
    });

    console.log("Refresh status:", refreshRes.status);

    if (!refreshRes.ok) {
      throw new Error("Session expired");
    }

    await new Promise((resolve) => setTimeout(resolve, 50));

    const retryRes = await fetch(path ? `${domain}/${path}` : domain, {
      ...options,
      credentials: "include",
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

  return data.data;
}
