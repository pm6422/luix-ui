import * as React from "react";
import { cn } from "@/lib/utils";

export interface DetailCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  icon?: React.ReactNode;
  title?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  children: React.ReactNode;
}

export function DetailCard({
  icon,
  title,
  action,
  className,
  headerClassName,
  contentClassName,
  children,
  ...props
}: DetailCardProps) {
  return (
    <div
      className={cn(
        "bg-card text-card-foreground shadow-sm p-2 gap-0 rounded-xl flex flex-col",
        className
      )}
      {...props}
    >
      {(title || icon || action) && (
        <div
          className={cn(
            "flex items-center justify-between mb-1.5 shrink-0 min-w-0 h-4",
            headerClassName
          )}
        >
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 min-w-0 leading-none">
            {icon && (
              <span className="text-primary/60 shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5">
                {icon}
              </span>
            )}
            {title && <span className="truncate">{title}</span>}
          </div>
          {action && <div className="flex items-center shrink-0 -mr-1">{action}</div>}
        </div>
      )}
      <div className={cn("flex-1 min-h-0", contentClassName)}>{children}</div>
    </div>
  );
}
