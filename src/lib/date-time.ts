export const DEFAULT_TIME_ZONE = "UTC";
export const DEFAULT_DATE_FORMAT = "YYYY-MM-DD";
export const DEFAULT_TIME_FORMAT = "HH:mm:ss";
export const DEFAULT_DATE_TIME_FORMAT = "YYYY-MM-DD HH:mm:ss";

export function formatDateTime(
  dateTimeFormat: string,
  timeZone: string,
  value?: string | number | null | Date,
): string {
  if (!value && value !== 0) {
    return "";
  }
  const rawValue =
    typeof value === "string" && /^\d+$/.test(value.trim())
      ? Number(value.trim())
      : value;
  const date = value instanceof Date ? value : new Date(rawValue);
  if (isNaN(date.getTime())) return "";

  try {
    const tz = timeZone || DEFAULT_TIME_ZONE;
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const parts = formatter.formatToParts(date);
    const getPart = (type: string) =>
      parts.find((p) => p.type === type)?.value || "";

    const YYYY = getPart("year");
    const MM = getPart("month");
    const DD = getPart("day");
    const HH = getPart("hour");
    const mm = getPart("minute");
    const ss = getPart("second");

    return dateTimeFormat
      .replace(/YYYY|yyyy/g, YYYY)
      .replace(/MM/g, MM)
      .replace(/DD|dd/g, DD)
      .replace(/HH/g, HH)
      .replace(/mm/g, mm)
      .replace(/ss/g, ss);
  } catch {
    return date.toLocaleString();
  }
}
