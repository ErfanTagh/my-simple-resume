/** Map i18n language code to Intl locale (e.g. 'de' -> 'de-DE') */
const toIntlLocale = (locale?: string): string => {
  if (!locale || locale === 'en') return 'en-US';
  if (locale === 'de') return 'de-DE';
  return locale;
};

/**
 * Format a date string from YYYY-MM format to readable format
 * @param dateString - Date in YYYY-MM format (e.g., "2025-03")
 * @param locale - Optional locale (e.g. 'de', 'en') for month names
 * @returns Formatted date (e.g., "Mar 2025" or "Mär 2025" for German)
 */
export const formatMonthYear = (dateString: string | undefined, locale?: string): string => {
  if (!dateString) return '';

  const match = dateString.match(/^(\d{4})-(\d{2})$/);
  if (!match) return dateString;

  const [, year, month] = match;
  const monthNum = parseInt(month, 10);
  if (monthNum < 1 || monthNum > 12) return dateString;

  const date = new Date(parseInt(year, 10), monthNum - 1, 1);
  return new Intl.DateTimeFormat(toIntlLocale(locale), {
    month: 'short',
    year: 'numeric',
  }).format(date);
};

/**
 * Format a date range
 * @param startDate - Start date in YYYY-MM format
 * @param endDate - End date in YYYY-MM format or empty for present
 * @param presentText - Text to show when endDate is empty (defaults to "Present")
 * @param locale - Optional locale for month names (e.g. 'de' for German)
 */
export const formatDateRange = (
  startDate: string | undefined,
  endDate: string | undefined,
  presentText: string = 'Present',
  locale?: string
): string => {
  const start = formatMonthYear(startDate, locale);
  const end = endDate ? formatMonthYear(endDate, locale) : presentText;

  if (!start && !end) return '';
  if (!start) return end;
  if (!end || end === presentText) return `${start} - ${presentText}`;

  return `${start} - ${end}`;
};

