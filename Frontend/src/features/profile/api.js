import { API_ENDPOINTS } from "../../services/config";
import { apiFetch } from "../../services/apiClient";

export async function getCurrentUserProfile() {
  return apiFetch(API_ENDPOINTS.profile, "getprofile", {
    method: "GET",
  });
}

export async function updateProfile(payload) {
  return apiFetch(API_ENDPOINTS.profile, "update", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function completeProfile(payload) {
  return apiFetch(API_ENDPOINTS.profile, "complete", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
