/**
 * Accent colors for the hosted public profile (/p/:id). Stored as public_profile_theme on the resume.
 */
export const PUBLIC_PROFILE_THEME_IDS = ["orange", "blue", "green", "violet"] as const;

export type PublicProfileThemeId = (typeof PUBLIC_PROFILE_THEME_IDS)[number];

export type HostedThemeColors = {
  accent: string;
  secondary: string;
  social: string;
};

export const HOSTED_PROFILE_THEME_COLORS: Record<PublicProfileThemeId, HostedThemeColors> = {
  orange: { accent: "#ef744b", secondary: "#d946a3", social: "#5eead4" },
  blue: { accent: "#2563eb", secondary: "#7c3aed", social: "#38bdf8" },
  green: { accent: "#16a34a", secondary: "#0d9488", social: "#6ee7b7" },
  violet: { accent: "#9333ea", secondary: "#db2777", social: "#c4b5fd" },
};

export function mergePublicProfileTheme(raw: unknown): PublicProfileThemeId {
  if (typeof raw !== "string") return "orange";
  const s = raw.trim().toLowerCase();
  if ((PUBLIC_PROFILE_THEME_IDS as readonly string[]).includes(s)) {
    return s as PublicProfileThemeId;
  }
  return "orange";
}
