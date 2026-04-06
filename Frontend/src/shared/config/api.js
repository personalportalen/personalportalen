const LOCALHOST_DOMAIN = "https://localhost:";
const GATEWAY_PORT = "7265";
export { BASE_URL };
export const BASE_URL = `${LOCALHOST_DOMAIN}${GATEWAY_PORT}`;

export const API_ENDPOINTS = {
  auth: `${BASE_URL}/auth`,
  profile: `${BASE_URL}/profile`,
  workshift: `${BASE_URL}/workshift`,
  booking: `${BASE_URL}/booking`,
};
