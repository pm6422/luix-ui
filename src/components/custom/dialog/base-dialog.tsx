import * as React from "react";
import { X } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import {
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export type BaseDialogSize = "sm" | "md" | "lg" | "xl" | "xxl" | "full";

export interface BaseDialogProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  size?: BaseDialogSize;
  className?: string;
  headerClassName?: string;
  titleClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  footer?: React.ReactNode;
  showCloseButton?: boolean;
}

const sizeClasses: Record<BaseDialogSize, string> = {
  sm: "sm:max-w-[425px]",
  md: "sm:max-w-[600px]",
  lg: "sm:max-w-[800px]",
  xl: "sm:max-w-[1000px] w-[95vw]",
  xxl: "sm:max-w-7xl w-[95vw]",
  full: "w-full md:w-[96vw] xl:w-[1300px] h-full md:h-[92vh] !max-w-none md:max-h-[92vh] !fixed !inset-0 !top-0 !left-0 !translate-x-0 !translate-y-0 md:!top-1/2 md:!left-1/2 md:!-translate-x-1/2 md:!-translate-y-1/2 rounded-none md:rounded-2xl border-none md:border",
};

export const BaseDialog = React.forwardRef<HTMLDivElement, BaseDialogProps>(
  (
    {
      title,
      description,
      children,
      size = "md",
      className,
      headerClassName,
      titleClassName,
      contentClassName = "p-4 md:p-6",
      footerClassName,
      footer,
      showCloseButton = true,
    },
    ref,
  ) => {
    return (
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          ref={ref}
          aria-describedby={description ? undefined : undefined}
          className={cn(
            "fixed top-[50%] left-[50%] z-50 flex flex-col w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-0 rounded-xl border border-muted/30 bg-background p-0 shadow-2xl duration-200 outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 sm:max-w-lg",
            "max-h-[90vh] overflow-hidden font-sans",
            sizeClasses[size],
            className,
          )}
        >
          {/* Sticky Header */}
          <DialogHeader
            className={cn(
              "relative py-2.5 pl-3.5 pr-10 md:pl-5 md:pr-12 bg-background/95 border-b border-border/60 shrink-0 text-left sm:text-left flex flex-row items-center justify-between",
              headerClassName,
            )}
          >
            <div className="flex-1 min-w-0">
              <DialogTitle
                className={cn(
                  "text-base md:text-lg font-bold tracking-tight text-foreground flex items-center gap-2 w-full",
                  titleClassName,
                )}
              >
                {title}
              </DialogTitle>
              {description && (
                <DialogDescription className="mt-0.5">
                  {description}
                </DialogDescription>
              )}
            </div>
            {showCloseButton && (
              <DialogClose className="absolute right-3.5 md:right-4 top-1/2 -translate-y-1/2 z-50 text-muted-foreground hover:text-foreground opacity-70 hover:opacity-100 transition-all hover:scale-105 cursor-pointer">
                <X size={18} className="stroke-[2.5]" />
                <span className="sr-only">Close</span>
              </DialogClose>
            )}
          </DialogHeader>

          {/* Scrollable Content */}
          <div
            className={cn(
              "flex-1 overflow-y-auto min-h-0 overscroll-contain",
              contentClassName,
            )}
          >
            {children}
          </div>

          {/* Optional Footer */}
          {footer && (
            <div
              className={cn(
                "px-5 py-3.5 bg-background border-t border-border/60 shrink-0 flex justify-end items-center gap-2",
                footerClassName,
              )}
            >
              {footer}
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPortal>
    );
  },
);

BaseDialog.displayName = "BaseDialog";
