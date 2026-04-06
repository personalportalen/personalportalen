import { apiFetch } from '../../services/apiClient';
import { API_ENDPOINTS } from '../../shared/config/api';

export async function getMe() {
  return apiFetch(API_ENDPOINTS.auth, 'me');
}

export async function checkEmailExists(email) {
  return apiFetch(API_ENDPOINTS.auth, 'verifyemail', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function signUp(userInformation) {
  console.log('Signup payload:', userInformation);
  return apiFetch(API_ENDPOINTS.auth, 'signup', {
    method: 'POST',
    body: JSON.stringify(userInformation),
  });
}

export async function signIn(email, password) {
  await apiFetch(API_ENDPOINTS.auth, 'signin', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function signOut() {
  return apiFetch(API_ENDPOINTS.auth, 'signout', {
    method: 'POST',
  });
}
