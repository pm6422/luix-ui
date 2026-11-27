import {
  DEFAULT_DATE_TIME_FORMAT,
  DEFAULT_TIME_ZONE,
  formatDateTime,
} from "@/lib/date-time";
import { cn } from "@/lib/utils";

export interface DateTimeDisplayProps {
  value?: string | number | null | Date;
  format?: string;
  timeZone?: string;
  suffix?: string;
  className?: string;
}

export const DateTimeDisplay = ({
  value,
  format = DEFAULT_DATE_TIME_FORMAT,
  timeZone = DEFAULT_TIME_ZONE,
  suffix,
  className,
}: DateTimeDisplayProps) => {
  const formattedValue = formatDateTime(format, timeZone, value);

  return (
    <span className={cn("tabular-nums", className)}>
      {formattedValue ? `${formattedValue}${suffix ?? ""}` : ""}
    </span>
  );
};
