function required(value, name) {
  if (!value) {
    throw new Error(`Missing required env variable: ${name}`);
  }
  return value;
}

export const env = {
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,

  apiGatewayUrl: required(
    import.meta.env.VITE_API_GATEWAY_URL,
    'VITE_API_GATEWAY_URL',
  ),

  enableDevAuthBypass:
    import.meta.env.DEV &&
    import.meta.env.VITE_ENABLE_DEV_AUTH_BYPASS === 'true',
};
