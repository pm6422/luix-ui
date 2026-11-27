import * as React from "react";
import { AltArrowLeftLinear } from "solar-icon-set";
import { cn } from "@/lib/utils";

export type BackButtonVariant = "capsule" | "icon" | "ghost";

const variantClasses: Record<BackButtonVariant, string> = {
  capsule:
    "h-8 md:h-8.5 px-2.5 md:px-3 bg-card/95 md:bg-card/60 dark:bg-card/95 md:dark:bg-white/[0.05] md:backdrop-blur-md border border-border/20 dark:border-white/[0.1] text-foreground hover:bg-muted/30 dark:hover:bg-white/[0.08] shadow-xs rounded-xl",
  icon: "h-8 w-8 md:h-8.5 md:w-8.5 p-0 bg-card/95 md:bg-card/60 dark:bg-card/95 md:dark:bg-white/[0.05] md:backdrop-blur-md border border-border/20 dark:border-white/[0.1] text-foreground hover:bg-muted/30 dark:hover:bg-white/[0.08] shadow-xs rounded-xl justify-center",
  ghost:
    "h-8 md:h-8.5 px-2 text-muted-foreground hover:text-foreground hover:bg-muted/20 rounded-lg",
};

export function getBackButtonClassName(
  variant: BackButtonVariant = "capsule",
  className?: string,
) {
  return cn(
    "inline-flex items-center gap-1.5 transition-all duration-200 active:scale-95 cursor-pointer select-none font-sans shrink-0 group",
    variantClasses[variant],
    className,
  );
}

export interface BackButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  label?: string;
  variant?: BackButtonVariant;
  iconSize?: number;
  className?: string;
}

export const BackButton = React.forwardRef<HTMLButtonElement, BackButtonProps>(
  (
    {
      href,
      label = "Back",
      variant = "capsule",
      iconSize = 15,
      className,
      onClick,
      ...props
    },
    ref,
  ) => {
    const content = (
      <>
        <AltArrowLeftLinear
          size={iconSize}
          className="shrink-0 transition-transform group-hover:-translate-x-0.5"
        />
        {variant !== "icon" && label && (
          <span className="text-xs font-bold tracking-tight truncate">
            {label}
          </span>
        )}
      </>
    );

    const classes = getBackButtonClassName(variant, className);

    if (href) {
      return (
        <a href={href} className={classes}>
          {content}
        </a>
      );
    }

    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        className={classes}
        {...props}
      >
        {content}
      </button>
    );
  },
);

BackButton.displayName = "BackButton";
