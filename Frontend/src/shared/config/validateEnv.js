import { env } from './env';

export function validateEnv() {
  const errors = [];

  if (!env.apiGatewayUrl) {
    errors.push('VITE_API_GATEWAY_URL is missing');
  } else {
    try {
      new URL(env.apiGatewayUrl);
    } catch {
      errors.push('VITE_API_GATEWAY_URL is not a valid URL');
    }

    if (env.apiGatewayUrl.endsWith('/')) {
      errors.push('VITE_API_GATEWAY_URL should not end with a trailing slash');
    }
  }

  if (errors.length > 0) {
    throw new Error(`Invalid app configuration:\n- ${errors.join('\n- ')}`);
  }
}
