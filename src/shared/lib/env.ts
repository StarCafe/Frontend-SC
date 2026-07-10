function getRequiredEnv(name: "NEXT_PUBLIC_API_BASE_URL" | "NEXT_PUBLIC_APP_BASE_URL") {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const API_BASE_URL = getRequiredEnv("NEXT_PUBLIC_API_BASE_URL");
const APP_BASE_URL = getRequiredEnv("NEXT_PUBLIC_APP_BASE_URL");

export const env = {
  apiBaseUrl: API_BASE_URL,
  appBaseUrl: APP_BASE_URL,
};
