const COOKIE_MAX_AGE = 60 * 60 * 8;

export function writeAuthCookies(role: string, token: string) {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `sc_role=${role}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
  document.cookie = `sc_token=${token}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
}

export function clearAuthCookies() {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = "sc_role=; path=/; max-age=0; samesite=lax";
  document.cookie = "sc_token=; path=/; max-age=0; samesite=lax";
}
