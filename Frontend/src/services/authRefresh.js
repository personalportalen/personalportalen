import { API_ENDPOINTS } from '../shared/config/api.js';

const isDev = import.meta.env.DEV;

function logInfo(...args) {
  if (isDev) console.info(...args);
}

export async function tryRefreshToken({ suppressLog = false } = {}) {
  try {
    const refreshRes = await fetch(`${API_ENDPOINTS.auth}/refresh-token`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!refreshRes.ok) {
      if (!suppressLog) {
        logInfo('[Auth] Refresh token failed - no active session');
      }
      return false;
    }

    if (!suppressLog) {
      logInfo('[Auth] Token refreshed successfully');
    }

    return true;
  } catch (error) {
    if (!suppressLog) {
      logInfo('[Auth] Refresh request failed');
    }
    return false;
  }
}
