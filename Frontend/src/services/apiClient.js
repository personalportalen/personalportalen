import { tryRefreshToken } from './authRefresh';

const isDev = import.meta.env.DEV;

function logInfo(...args) {
  if (isDev) console.info(...args);
}

function logWarn(...args) {
  if (isDev) console.warn(...args);
}

async function parseJsonSafe(res) {
  const contentType = res.headers.get('content-type');

  if (contentType && contentType.includes('application/json')) {
    return await res.json();
  }

  return null;
}

async function buildFetchOptions(options = {}) {
  const fetchOptions = {
    credentials: 'include',
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : { 'Content-Type': 'application/json' }),
      ...(options.headers || {}),
    },
    ...options,
  };

  if (
    fetchOptions.body &&
    typeof fetchOptions.body === 'object' &&
    !(fetchOptions.body instanceof FormData)
  ) {
    fetchOptions.body = JSON.stringify(fetchOptions.body);
  }

  return fetchOptions;
}

export async function apiFetch(domain, path = '', options = {}) {
  const {
    retryOn401 = true,
    suppress401Log = false,
    ...fetchOverrides
  } = options;

  const url = path ? `${domain}/${path}` : domain;
  const fetchOptions = await buildFetchOptions(fetchOverrides);

  let res = await fetch(url, fetchOptions);

  if (res.status === 401 && retryOn401) {
    if (!suppress401Log) {
      logInfo(`[API] 401 received for ${url}, attempting token refresh...`);
    }

    const refreshSucceeded = await tryRefreshToken({
      suppressLog: suppress401Log,
    });

    if (refreshSucceeded) {
      res = await fetch(url, fetchOptions);
    } else {
      if (!suppress401Log) {
        logInfo(`[API] No active session for ${url}`);
      }

      const unauthorizedError = new Error('Unauthorized');
      unauthorizedError.status = 401;
      throw unauthorizedError;
    }
  }

  const data = await parseJsonSafe(res);

  if (!res.ok) {
    const error = new Error(data?.message || `HTTP ${res.status}`);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  if (data && data.succeeded === false) {
    const error = new Error(data.message || 'API Error');
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data?.data !== undefined ? data.data : data;
}
