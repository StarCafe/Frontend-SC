function getRequiredValue(value: string | undefined, name: string) {
  const normalized = value?.trim();

  if (!normalized) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return normalized;
}

export const env = {
  apiBaseUrl: getRequiredValue(
    process.env.NEXT_PUBLIC_API_URL,
    "NEXT_PUBLIC_API_URL",
  ),
  appBaseUrl: getRequiredValue(
    process.env.NEXT_PUBLIC_APP_BASE_URL,
    "NEXT_PUBLIC_APP_BASE_URL",
  ),
};
