import * as React from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { type VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface LoadingButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const LoadingDots = () => (
  <span
    className="relative ml-1.5 inline-flex items-center justify-center gap-0.5"
    aria-hidden="true"
  >
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="size-1 rounded-full bg-current animate-bounce"
        style={{
          animationDuration: "0.75s",
          animationDelay: `${i * 120}ms`,
        }}
      />
    ))}
  </span>
);

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  (
    {
      className,
      loading = false,
      children,
      disabled,
      variant,
      size,
      asChild = false,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }), "relative")}
        ref={ref}
        disabled={loading || disabled}
        aria-busy={loading || undefined}
        {...props}
      >
        <span className="inline-flex items-center">
          <Slottable>{children}</Slottable>
          {loading && <LoadingDots />}
        </span>
      </Comp>
    );
  },
);
LoadingButton.displayName = "LoadingButton";

export { LoadingButton };
