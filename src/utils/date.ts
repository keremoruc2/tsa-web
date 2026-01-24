// Shared date helpers to enforce date-only (UTC midnight) semantics
// We persist event dates as Date objects at 00:00:00.000Z and expose them publicly as 'YYYY-MM-DD'

/** Convert a Date (assumed UTC or with correct absolute value) to a date-only string YYYY-MM-DD */
export function toDateOnlyString(d: Date): string {
  if (!(d instanceof Date)) d = new Date(d as unknown as string);
  // Use toISOString which is always UTC then slice date part
  return d.toISOString().slice(0, 10);
}

/** Format a date-only string (YYYY-MM-DD) into a human readable form without timezone shifts. */
export function formatDateOnlyHuman(dateStr: string, locale: string = 'en-US', opts?: Intl.DateTimeFormatOptions): string {
  // Treat as UTC midnight to avoid local TZ shifting backwards
  // Append 'T00:00:00.000Z' to ensure parsing as UTC
  const d = new Date(`${dateStr}T00:00:00.000Z`);
  // If custom opts are provided, respect them; otherwise default to Month Day, Year.
  const base: Intl.DateTimeFormatOptions = opts
    ? {}
    : { month: 'long', day: 'numeric', year: 'numeric' };
  const formatOpts: Intl.DateTimeFormatOptions = {
    ...base,
    ...(opts || {}),
    // always enforce UTC
    timeZone: 'UTC',
  };
  return d.toLocaleDateString(locale, formatOpts);
}

/** Ensure an incoming string is truncated to date-only form if it contains a time */
export function ensureDateOnly(str: string): string {
  if (!str) return str;
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
  const m = str.match(/^(\d{4}-\d{2}-\d{2})/);
  return m ? m[1] : str;
}
