// Shared helpers for handling language proficiency levels (Native, Fluent, etc.)
// in a canonical, translation-friendly way across the app.

export const KNOWN_PROFICIENCY_KEYS = [
  "native",
  "fluent",
  "advanced",
  "intermediate",
  "basic",
] as const;

export type ProficiencyKey = (typeof KNOWN_PROFICIENCY_KEYS)[number];

/**
 * Normalize any stored proficiency value to a canonical key when possible.
 * - If the value already matches a known key (case-insensitive), returns the key (lowercase).
 * - Otherwise, returns the original value so we don't lose legacy/custom text.
 */
export const normalizeProficiencyKey = (
  value?: unknown,
): string | undefined => {
  if (value === undefined || value === null) return undefined;
  const str = String(value);
  const lower = str.toLowerCase().trim();
  if (KNOWN_PROFICIENCY_KEYS.includes(lower as ProficiencyKey)) {
    return lower;
  }
  // Keep original string for legacy/custom labels
  return str;
};

/**
 * Format a stored proficiency value using the current translation function.
 * Works for both canonical keys and legacy free-text labels.
 */
export const formatProficiency = (
  t: (key: string) => string,
  value?: unknown,
): string => {
  if (value === undefined || value === null) return "";
  const str = String(value);
  const lower = str.toLowerCase().trim();

  if (KNOWN_PROFICIENCY_KEYS.includes(lower as ProficiencyKey)) {
    const translationKey = `resume.proficiency.${lower}`;
    const translated = t(translationKey);
    if (translated && translated !== translationKey) {
      return translated;
    }
    return str;
  }

  // Fallback for arbitrary/legacy strings
  return str;
};

