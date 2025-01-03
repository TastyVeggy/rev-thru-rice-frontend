export const config = {
  appEnv: import.meta.env.VITE_APP_ENV || 'development',
  apiUrl:
    import.meta.env.VITE_APP_ENV === 'production'
      ? import.meta.env.VITE_PROD_BACKEND_API_URL
      : import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:8080',
  countryCodesJsonPath:
    import.meta.env.VITE_COUNTRY_CODE_JSON_PATH || '/country-codes.json',
  logoUrl: import.meta.env.VITE_LOGO_URL || '/logo.png',
};
