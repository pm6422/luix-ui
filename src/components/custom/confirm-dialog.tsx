import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  CheckCircleBoldDuotone,
  DangerTriangleBoldDuotone,
  InfoCircleBoldDuotone,
} from "solar-icon-set";

export type ConfirmVariant = "destructive" | "warning" | "info" | "success";

export interface ConfirmDialogProps {
  children: React.ReactNode;
  title?: string;
  message: React.ReactNode;
  onClickYes: () => void | Promise<void>;
  onClickNo?: () => void;
  showNoButton?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  variant?: ConfirmVariant;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

const variantStyles: Record<
  ConfirmVariant,
  {
    icon: React.ReactNode;
    bg: string;
    border: string;
    text: string;
    button: string;
    glow: string;
  }
> = {
  destructive: {
    icon: <DangerTriangleBoldDuotone size={26} />,
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    text: "text-rose-500",
    button:
      "bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border-rose-500/20",
    glow: "from-rose-500/10 to-transparent",
  },
  warning: {
    icon: <DangerTriangleBoldDuotone size={26} />,
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    text: "text-amber-500",
    button:
      "bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border-amber-500/20",
    glow: "from-amber-500/10 to-transparent",
  },
  info: {
    icon: <InfoCircleBoldDuotone size={26} />,
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-500",
    button:
      "bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 border-blue-500/20",
    glow: "from-blue-500/10 to-transparent",
  },
  success: {
    icon: <CheckCircleBoldDuotone size={26} />,
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-500",
    button:
      "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border-emerald-500/20",
    glow: "from-emerald-500/10 to-transparent",
  },
};

export const ConfirmDialog = React.forwardRef<
  HTMLButtonElement,
  ConfirmDialogProps
>(
  (
    {
      children,
      title = "Confirm Action",
      message,
      onClickYes,
      onClickNo,
      showNoButton = true,
      open,
      onOpenChange,
      variant = "destructive",
      confirmText = "Confirm",
      cancelText = "Cancel",
      loading: externalLoading = false,
      ...props
    },
    ref,
  ) => {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
    const [pending, setPending] = useState(false);

    const isControlled = open !== undefined;
    const isOpen = isControlled ? open : uncontrolledOpen;
    const isLoading = externalLoading || pending;

    const handleOpenChange = (newOpen: boolean) => {
      if (isLoading && !newOpen) return;
      if (!isControlled) {
        setUncontrolledOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    };

    const handleConfirm = async () => {
      if (isLoading) return;
      try {
        const result = onClickYes();
        if (result instanceof Promise) {
          setPending(true);
          await result;
        }
        handleOpenChange(false);
      } finally {
        setPending(false);
      }
    };

    const currentVariant = variantStyles[variant];

    return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild {...props} ref={ref}>
          {children}
        </DialogTrigger>
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-[400px] rounded-3xl p-0 overflow-hidden bg-background/95 backdrop-blur-xl border border-border/50 shadow-2xl z-[1002] gap-0"
        >
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-b opacity-20 dark:opacity-40 pointer-events-none",
              currentVariant.glow,
            )}
          />

          {/* Header */}
          <div className="relative p-6 pt-7 pb-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div
                className={cn(
                  "size-12 aspect-square shrink-0 flex items-center justify-center rounded-2xl border shadow-inner transition-all",
                  currentVariant.bg,
                  currentVariant.border,
                  currentVariant.text,
                )}
              >
                {currentVariant.icon}
              </div>

              <div className="space-y-2 max-w-[320px]">
                <DialogTitle className="text-base sm:text-lg font-black tracking-tight leading-snug text-foreground">
                  {title}
                </DialogTitle>
                <DialogDescription className="text-xs sm:text-sm font-medium text-muted-foreground leading-relaxed">
                  {message}
                </DialogDescription>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="relative p-4 pt-3 border-t border-border/40 flex items-center gap-3">
            {showNoButton && (
              <DialogClose asChild>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={onClickNo}
                  className="flex-1 flex items-center justify-center h-10 rounded-xl bg-accent/60 hover:bg-accent hover:text-accent-foreground text-muted-foreground text-xs sm:text-sm font-semibold transition-all active:scale-95 cursor-pointer border border-border/40 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {cancelText}
                </button>
              </DialogClose>
            )}
            <button
              type="button"
              disabled={isLoading}
              onClick={handleConfirm}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 h-10 rounded-xl text-xs sm:text-sm font-bold text-center transition-all active:scale-95 cursor-pointer border disabled:opacity-50 disabled:pointer-events-none",
                currentVariant.button,
              )}
            >
              <span>{confirmText}</span>
              {isLoading && (
                <span className="size-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    );
  },
);

ConfirmDialog.displayName = "ConfirmDialog";
