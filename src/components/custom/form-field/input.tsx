import type { ReactNode } from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import { Key } from "react";
import { cn } from "@/lib/utils";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RequiredFormLabel } from "../required-form-label";
import { formControlClassName } from "./control-styles";

interface Props<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  key?: Key;
  label?: string;
  value?: string;
  defaultValue?: string;
  type?: Parameters<typeof Input>[0]["type"] | "textarea";
  description?: string;
  placeholder?: string;
  onFocus?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  subComponent?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
  icon?: ReactNode;
  inputClassName?: string;
  formItemClassName?: string;
  hide?: boolean;
  step?: string | number;
  min?: string | number;
  hideMessage?: boolean;
}

const InputFormField = <TFieldValues extends FieldValues>({
  control,
  name,
  key,
  label,
  value,
  defaultValue,
  description,
  onFocus,
  onKeyDown,
  type = "text",
  placeholder,
  subComponent,
  required,
  disabled,
  prefix,
  suffix,
  icon,
  inputClassName,
  formItemClassName,
  hide = false,
  step,
  min,
  hideMessage = true,
}: Props<TFieldValues>) =>
  !hide && (
    <FormField
      control={disabled ? undefined : control}
      name={name as Path<TFieldValues>}
      key={key}
      render={({ field: { value: formFieldValue, ...rest }, fieldState }) => (
        <FormItem className={formItemClassName}>
          {label && (
            <RequiredFormLabel htmlFor={name.toString()} required={required}>
              {label}
            </RequiredFormLabel>
          )}
          <FormControl>
            <div className="relative flex w-full items-center gap-2">
              {prefix && prefix}
              {type === "textarea" ? (
                <Textarea
                  id={name.toString()}
                  className={cn(formControlClassName, inputClassName)}
                  placeholder={placeholder}
                  onFocus={onFocus}
                  defaultValue={defaultValue}
                  value={value || formFieldValue || ""}
                  disabled={disabled}
                  aria-invalid={fieldState.invalid}
                  {...rest}
                />
              ) : (
                <Input
                  id={name.toString()}
                  className={cn(formControlClassName, inputClassName)}
                  type={type}
                  step={step}
                  min={min}
                  onFocus={onFocus}
                  onKeyDown={onKeyDown}
                  placeholder={placeholder}
                  defaultValue={defaultValue}
                  value={value || formFieldValue || ""}
                  disabled={disabled}
                  aria-invalid={fieldState.invalid}
                  {...rest}
                />
              )}
              {suffix && suffix}
              {!suffix && icon && icon}
              {subComponent}
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          {!hideMessage && <FormMessage />}
        </FormItem>
      )}
    />
  );

export default InputFormField;
