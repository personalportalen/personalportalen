import { PROFILE_API_URL } from "./config";
import { apiFetch } from "./config";

export async function getCurrentUserProfile() {
  return apiFetch(PROFILE_API_URL, "", {
    method: "GET",
  });
}

export async function updateProfile(payload) {
  return apiFetch(PROFILE_API_URL, "", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
