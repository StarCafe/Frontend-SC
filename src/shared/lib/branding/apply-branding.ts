import type { BusinessBrandingEntity } from "@/modules/business-branding/domain/business-branding.entity";

const brandingVariables = [
  "--color-background",
  "--color-background-soft",
  "--color-surface",
  "--color-surface-strong",
  "--color-surface-muted",
  "--color-panel",
  "--color-panel-dark",
  "--color-border",
  "--color-border-strong",
  "--color-ink",
  "--color-muted",
  "--color-primary",
  "--color-primary-strong",
  "--color-secondary",
  "--color-accent",
] as const;

const themePresets: Record<string, Partial<Record<(typeof brandingVariables)[number], string>>> = {
  forest: {
    "--color-background": "#041914",
    "--color-background-soft": "#0b231d",
    "--color-surface": "#f7f3ed",
    "--color-surface-strong": "#efe6d8",
    "--color-surface-muted": "#e6e0d6",
    "--color-panel": "rgba(247, 243, 237, 0.9)",
    "--color-panel-dark": "rgba(5, 24, 19, 0.76)",
    "--color-border": "rgba(19, 37, 31, 0.12)",
    "--color-border-strong": "rgba(19, 37, 31, 0.24)",
    "--color-ink": "#1f221d",
    "--color-muted": "#76817b",
    "--color-primary": "#006241",
    "--color-primary-strong": "#0b4a33",
    "--color-secondary": "#13251f",
    "--color-accent": "#c89a58",
  },
  ocean: {
    "--color-background": "#061826",
    "--color-background-soft": "#10263a",
    "--color-surface": "#eef6fb",
    "--color-surface-strong": "#dbeaf5",
    "--color-surface-muted": "#cfe2ef",
    "--color-panel": "rgba(238, 246, 251, 0.92)",
    "--color-panel-dark": "rgba(8, 26, 41, 0.8)",
    "--color-border": "rgba(19, 49, 76, 0.14)",
    "--color-border-strong": "rgba(19, 49, 76, 0.24)",
    "--color-ink": "#163040",
    "--color-muted": "#6a8192",
    "--color-primary": "#0f7ea8",
    "--color-primary-strong": "#0d5f7e",
    "--color-secondary": "#17384a",
    "--color-accent": "#68bfd6",
  },
  ember: {
    "--color-background": "#22110f",
    "--color-background-soft": "#341b17",
    "--color-surface": "#faf1eb",
    "--color-surface-strong": "#f0ddd1",
    "--color-surface-muted": "#e8d0c1",
    "--color-panel": "rgba(250, 241, 235, 0.92)",
    "--color-panel-dark": "rgba(37, 18, 15, 0.8)",
    "--color-border": "rgba(82, 41, 28, 0.14)",
    "--color-border-strong": "rgba(82, 41, 28, 0.24)",
    "--color-ink": "#2d1e1b",
    "--color-muted": "#8a6d66",
    "--color-primary": "#c74d2f",
    "--color-primary-strong": "#9d371f",
    "--color-secondary": "#4f271f",
    "--color-accent": "#efb062",
  },
  midnight: {
    "--color-background": "#11131d",
    "--color-background-soft": "#181b29",
    "--color-surface": "#edf0fb",
    "--color-surface-strong": "#dce2f2",
    "--color-surface-muted": "#d1d8eb",
    "--color-panel": "rgba(237, 240, 251, 0.92)",
    "--color-panel-dark": "rgba(16, 18, 28, 0.82)",
    "--color-border": "rgba(44, 50, 83, 0.14)",
    "--color-border-strong": "rgba(44, 50, 83, 0.24)",
    "--color-ink": "#21263c",
    "--color-muted": "#727996",
    "--color-primary": "#5b67d8",
    "--color-primary-strong": "#434db0",
    "--color-secondary": "#262c47",
    "--color-accent": "#a8b5ff",
  },
};

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
  const preset = themePresets[branding.themeKey];

  if (preset) {
    brandingVariables.forEach((variable) => {
      const value = preset[variable] ?? defaultVariables?.[variable] ?? "";
      document.documentElement.style.setProperty(variable, value);
    });
  } else {
    resetBrandingTheme();
  }

  const primaryColor = normalizeHex(branding.primaryColor);

  if (!primaryColor) {
    return;
  }

  document.documentElement.style.setProperty("--color-primary", primaryColor);
  document.documentElement.style.setProperty("--color-primary-strong", shadeHex(primaryColor, 0.72));
  document.documentElement.style.setProperty("--color-accent", shadeHex(primaryColor, 1.12));
}
