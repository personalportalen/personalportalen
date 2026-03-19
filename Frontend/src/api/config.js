const LOCALHOST_DOMAIN = "https://localhost:";

const AUTH_PORT = "7155";
const PROFILE_PORT = "7294";
const WORKSHIFT_PORT = "7103";
const BOOKING_PORT = "7213";

export const AUTH_API_URL = `${LOCALHOST_DOMAIN}${AUTH_PORT}/api/auth`;
export const PROFILE_API_URL = `${LOCALHOST_DOMAIN}${PROFILE_PORT}/api/profile`;
export const WORKSHIFT_API_URL = `${LOCALHOST_DOMAIN}${WORKSHIFT_PORT}/api/workshift`;
export const BOOKING_API_URL = `${LOCALHOST_DOMAIN}${BOOKING_PORT}/api/booking`;

export async function apiFetch(domain, path, options = {}) {
  const res = await fetch(`${domain}/${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });
  const data = await res.json();
  if (!data.succeeded) {
    throw new Error(data.message || "API Error");
  }
  return data.data;
}
