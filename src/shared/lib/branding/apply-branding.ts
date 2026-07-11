import type { BusinessBrandingEntity } from "@/modules/business-branding/domain/business-branding.entity";

const brandingVariables = [
  "--color-primary",
  "--color-primary-strong",
  "--color-accent",
] as const;

let defaultVariables: Record<string, string> | null = null;

function normalizeHex(value: string) {
  const normalized = value.trim();

  if (/^#[0-9a-fA-F]{6}$/.test(normalized)) {
    return normalized;
  }

  if (/^#[0-9a-fA-F]{3}$/.test(normalized)) {
    const [, r, g, b] = normalized;
    return `#${r}${r}${g}${g}${b}${b}`;
  }

  return null;
}

function shadeHex(hex: string, multiplier: number) {
  const normalized = normalizeHex(hex);

  if (!normalized) {
    return hex;
  }

  const red = Math.max(0, Math.min(255, Math.round(parseInt(normalized.slice(1, 3), 16) * multiplier)));
  const green = Math.max(0, Math.min(255, Math.round(parseInt(normalized.slice(3, 5), 16) * multiplier)));
  const blue = Math.max(0, Math.min(255, Math.round(parseInt(normalized.slice(5, 7), 16) * multiplier)));

  return `#${red.toString(16).padStart(2, "0")}${green
    .toString(16)
    .padStart(2, "0")}${blue.toString(16).padStart(2, "0")}`;
}

function ensureDefaultVariables() {
  if (typeof window === "undefined" || defaultVariables) {
    return;
  }

  const styles = getComputedStyle(document.documentElement);
  defaultVariables = Object.fromEntries(
    brandingVariables.map((variable) => [variable, styles.getPropertyValue(variable).trim()]),
  );
}

export function resetBrandingTheme() {
  if (typeof window === "undefined") {
    return;
  }

  ensureDefaultVariables();

  if (!defaultVariables) {
    return;
  }

  brandingVariables.forEach((variable) => {
    document.documentElement.style.setProperty(variable, defaultVariables?.[variable] ?? "");
  });
}

export function applyBrandingTheme(branding: BusinessBrandingEntity) {
  if (typeof window === "undefined") {
    return;
  }

  ensureDefaultVariables();

  const primaryColor = normalizeHex(branding.primaryColor);

  if (!primaryColor) {
    resetBrandingTheme();
    return;
  }

  document.documentElement.style.setProperty("--color-primary", primaryColor);
  document.documentElement.style.setProperty("--color-primary-strong", shadeHex(primaryColor, 0.72));
  document.documentElement.style.setProperty("--color-accent", shadeHex(primaryColor, 1.12));
}
