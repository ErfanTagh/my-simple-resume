/**
 * Format a date string from YYYY-MM format to readable format
 * @param dateString - Date in YYYY-MM format (e.g., "2025-03")
 * @returns Formatted date (e.g., "Mar 2025") or original string if invalid
 */
export const formatMonthYear = (dateString: string | undefined): string => {
  if (!dateString) return '';
  
  // Check if it's in YYYY-MM format
  const match = dateString.match(/^(\d{4})-(\d{2})$/);
  if (!match) return dateString;
  
  const [, year, month] = match;
  const monthNum = parseInt(month, 10);
  
  // Month names (short form)
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  if (monthNum < 1 || monthNum > 12) return dateString;
  
  return `${monthNames[monthNum - 1]} ${year}`;
};

/**
 * Format a date range
 * @param startDate - Start date in YYYY-MM format
 * @param endDate - End date in YYYY-MM format or empty for present
 * @returns Formatted date range (e.g., "Mar 2025 - Dec 2025" or "Mar 2025 - Present")
 */
export const formatDateRange = (startDate: string | undefined, endDate: string | undefined): string => {
  const start = formatMonthYear(startDate);
  const end = endDate ? formatMonthYear(endDate) : 'Present';
  
  if (!start && !end) return '';
  if (!start) return end;
  if (!end || end === 'Present') return `${start} - Present`;
  
  return `${start} - ${end}`;
};

