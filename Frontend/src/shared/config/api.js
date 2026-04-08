export const BASE_URL = import.meta.env.VITE_API_GATEWAY_URL;

export const API_ENDPOINTS = {
  auth: `${BASE_URL}/auth`,
  profile: `${BASE_URL}/profile`,
  workshift: `${BASE_URL}/workshift`,
  booking: `${BASE_URL}/booking`,
};
