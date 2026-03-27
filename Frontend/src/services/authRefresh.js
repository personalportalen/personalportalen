import { API_ENDPOINTS } from "./config";

export async function tryRefreshToken() {
  const refreshRes = await fetch(`${API_ENDPOINTS.auth}/refresh-token`, {
    method: "POST",
    credentials: "include",
  });

  if (!refreshRes.ok) {
    throw new Error("Session expired");
  }

  await new Promise((resolve) => setTimeout(resolve, 50));
}
