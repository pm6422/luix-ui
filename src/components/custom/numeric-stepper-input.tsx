import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";

export interface NumericStepperInputProps<
  T extends number | string = number | string,
> extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "prefix"> {
  value: T;
  onChange: (value: T) => void;
  onBlur?: () => void;
  step: number;
  min?: number;
  max?: number;
  precision?: number;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
  placeholder?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  inputClassName?: string;
}

function NumericStepperInputInner<T extends number | string = number | string>(
  {
    value,
    onChange,
    onBlur,
    step,
    min = 0,
    max,
    precision,
    disabled = false,
    invalid = false,
    className,
    placeholder,
    prefix,
    suffix,
    inputClassName,
    id,
    ...rest
  }: NumericStepperInputProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const emitValue = (next: number | string) => {
    onChange((typeof value === "string" ? String(next) : next) as T);
  };
    const formatValue = (val: number | string): string => {
      if (val === "" || val === null || val === undefined) return "";
      const num = Number(val);
      if (isNaN(num)) return "";
      return precision !== undefined ? num.toFixed(precision) : String(num);
    };

    const [localText, setLocalText] = useState(() => formatValue(value));
    const isFocused = useRef(false);

    useEffect(() => {
      if (!isFocused.current) {
        setLocalText(formatValue(value));
      }
    }, [value, precision]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const text = e.target.value;
      setLocalText(text);
      const num = parseFloat(text);
      if (!isNaN(num)) {
        emitValue(precision !== undefined && precision > 0 ? text : num);
      } else if (text === "") {
        emitValue(0);
      }
    };

    const handleBlur = () => {
      isFocused.current = false;
      let num = parseFloat(localText);
      if (isNaN(num)) {
        num = min ?? 0;
      }
      if (min !== undefined && num < min) {
        num = min;
      }
      if (max !== undefined && num > max) {
        num = max;
      }
      if (precision === 0) {
        num = Math.round(num);
      }
      const formatted = formatValue(num);
      setLocalText(formatted);
      emitValue(precision !== undefined && precision > 0 ? formatted : num);
      onBlur?.();
    };

    const handleDecrement = (e: React.SyntheticEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      const current = parseFloat(localText) || 0;
      let next = current - step;
      if (min !== undefined && next < min) {
        next = min;
      }
      if (precision !== undefined) {
        next = Number(next.toFixed(precision));
      }
      const formatted = formatValue(next);
      setLocalText(formatted);
      emitValue(precision !== undefined && precision > 0 ? formatted : next);
    };

    const handleIncrement = (e: React.SyntheticEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      const current = parseFloat(localText) || 0;
      let next = current + step;
      if (max !== undefined && next > max) {
        next = max;
      }
      if (precision !== undefined) {
        next = Number(next.toFixed(precision));
      }
      const formatted = formatValue(next);
      setLocalText(formatted);
      emitValue(precision !== undefined && precision > 0 ? formatted : next);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        handleIncrement(e);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        handleDecrement(e);
      }
    };

    const currentNum = parseFloat(localText);
    const isMinReached =
      min !== undefined && !isNaN(currentNum) && currentNum <= min;
    const isMaxReached =
      max !== undefined && !isNaN(currentNum) && currentNum >= max;

    return (
      <div
        ref={ref}
        id={id}
        className={cn(
          "border-border/40 bg-muted/15 relative flex h-9 w-full min-w-0 items-center justify-between overflow-hidden rounded-md border transition-[color,box-shadow]",
          "focus-within:border-foreground/20 focus-within:ring-foreground/15 focus-within:ring-1",
          disabled && "pointer-events-none opacity-50",
          className,
          invalid &&
            "!border-destructive/40 dark:!border-destructive/40 focus-within:!border-destructive/60 dark:focus-within:!border-destructive/60",
        )}
        {...rest}
      >
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled || isMinReached}
          onClick={handleDecrement}
          className={cn(
            "text-muted-foreground flex h-full w-8 shrink-0 touch-manipulation items-center justify-center transition-all sm:w-9",
            "hover:bg-muted/30 hover:text-foreground active:scale-90",
            "disabled:pointer-events-none disabled:opacity-20",
          )}
          aria-label="Decrease"
        >
          <Minus size={14} className="stroke-[2.5]" />
        </button>

        <div className="relative flex h-full flex-1 min-w-0 items-center justify-center px-1">
          {prefix && (
            <span className="text-muted-foreground/70 pointer-events-none shrink-0 text-xs font-black tracking-tight select-none mr-0.5">
              {prefix}
            </span>
          )}
          <input
            type="text"
            inputMode={precision === 0 ? "numeric" : "decimal"}
            value={localText}
            disabled={disabled}
            placeholder={placeholder}
            onFocus={() => {
              isFocused.current = true;
            }}
            onChange={handleInputChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className={cn(
              "text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground h-full w-full min-w-0 flex-1 border-0 bg-transparent px-0.5 text-center text-sm font-black tracking-tight tabular-nums outline-none",
              inputClassName,
            )}
          />
          {suffix && (
            <span className="text-muted-foreground/70 pointer-events-none shrink-0 text-xs font-black tracking-tight select-none ml-0.5">
              {suffix}
            </span>
          )}
        </div>

        <button
          type="button"
          tabIndex={-1}
          disabled={disabled || isMaxReached}
          onClick={handleIncrement}
          className={cn(
            "text-muted-foreground flex h-full w-8 shrink-0 touch-manipulation items-center justify-center transition-all sm:w-9",
            "hover:bg-muted/30 hover:text-foreground active:scale-90",
            "disabled:pointer-events-none disabled:opacity-20",
          )}
          aria-label="Increase"
        >
          <Plus size={14} className="stroke-[2.5]" />
        </button>
      </div>
    );
}

export const NumericStepperInput = React.forwardRef(NumericStepperInputInner) as <
  T extends number | string = number | string,
>(
  props: NumericStepperInputProps<T> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement | null;

(NumericStepperInput as React.FC).displayName = "NumericStepperInput";
