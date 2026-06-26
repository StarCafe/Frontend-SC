const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";
const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_BASE_URL ?? "http://localhost:3000";

export const env = {
  apiBaseUrl: API_BASE_URL,
  appBaseUrl: APP_BASE_URL,
};
