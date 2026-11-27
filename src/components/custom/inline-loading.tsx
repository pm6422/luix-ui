import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface InlineLoadingProps {
  /** Text to display alongside the spinner. Defaults to "Loading...". Pass empty string or null to omit text. */
  text?: string | null;
  /** Size variant: sm (14px), md (20px), lg (28px) */
  size?: "sm" | "md" | "lg";
  /** Layout direction: vertical (stacked) or horizontal (inline) */
  layout?: "vertical" | "horizontal";
  /** Extra container classes */
  className?: string;
  /** Extra spinner classes (e.g. text-muted-foreground instead of text-primary) */
  spinnerClassName?: string;
}

export function InlineLoading({
  text = "Loading...",
  size = "md",
  layout = "vertical",
  className,
  spinnerClassName,
}: InlineLoadingProps) {
  const iconSize = size === "sm" ? 14 : size === "lg" ? 28 : 20;
  const textSize = size === "sm" ? "text-[11px]" : size === "lg" ? "text-sm" : "text-xs";

  return (
    <div
      className={cn(
        "flex items-center justify-center text-muted-foreground",
        layout === "vertical" ? "flex-col gap-2.5 py-8" : "gap-2 py-2",
        className,
      )}
    >
      <Loader2
        size={iconSize}
        className={cn("animate-spin text-primary shrink-0", spinnerClassName)}
      />
      {text && (
        <span className={cn(textSize, "font-bold tracking-tight text-muted-foreground")}>
          {text}
        </span>
      )}
    </div>
  );
}

export default InlineLoading;
