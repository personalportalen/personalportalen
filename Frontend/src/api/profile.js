import { PROFILE_API_URL } from "./config";
import { apiFetch } from "./config";

export async function getCurrentUser() {
  return apiFetch(PROFILE_API_URL, "", {
    method: "GET",
  });
}
