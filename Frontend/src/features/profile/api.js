import { apiFetch } from '../../services/apiClient';
import { API_ENDPOINTS } from '../../shared/config/api';

export async function getCurrentUserProfile() {
  return apiFetch(API_ENDPOINTS.profile, 'getprofile', {
    method: 'GET',
  });
}

export async function updateProfile(payload) {
  console.log('payload:', payload);

  return apiFetch(API_ENDPOINTS.profile, 'update', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function completeProfile(payload) {
  return apiFetch(API_ENDPOINTS.profile, 'complete', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function getCurrentUserProfileWithRetry() {
  const timeoutMs = 10000; // max 10 sekunder
  const start = Date.now();

  let delayMs = 200;

  while (Date.now() - start < timeoutMs) {
    try {
      return await getCurrentUserProfile();
    } catch (err) {
      if (err.status === 404) {
        await new Promise((r) => setTimeout(r, delayMs));
        delayMs = Math.min(delayMs * 1.5, 2000);
        continue;
      }
      throw err;
    }
  }

  throw new Error('Profile not ready after timeout');
}
