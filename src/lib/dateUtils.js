// All dates are stored as UTC ISO strings.
// URL slug format: "05-mar-2026" (DD-MMM-YYYY, lowercase month abbreviation)

const MONTHS = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];

/**
 * "2026-03-05T15:24:00.000Z" → "05-mar-2026"
 */
export function dateToSlug(dateStr) {
  const d = new Date(dateStr);
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = MONTHS[d.getUTCMonth()];
  const year = d.getUTCFullYear();
  return `${day}-${month}-${year}`;
}

/**
 * "05-mar-2026" → Date object (UTC midnight)
 */
export function slugToDate(slug) {
  const [day, monthStr, year] = slug.split("-");
  const monthIndex = MONTHS.indexOf(monthStr.toLowerCase());
  if (monthIndex === -1) return null;
  return new Date(Date.UTC(parseInt(year), monthIndex, parseInt(day)));
}

/**
 * "2026-03-05T15:24:00.000Z" → "March 2026"
 */
export function dateToMonthLabel(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleString("default", { month: "long", year: "numeric", timeZone: "UTC" });
}
