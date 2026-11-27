import type { Control, FieldValues, Path } from "react-hook-form";
import { cn } from "@/lib/utils";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { RequiredFormLabel } from "../required-form-label";
import { formControlClassName } from "./control-styles";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Key } from "react";

interface Props<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: keyof TFieldValues;
  key?: Key;
  label?: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  description?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  inputClassName?: string;
  selectContentClassName?: string;
  formItemClassName?: string;
  hide?: boolean;
  hideMessage?: boolean;
}

const SelectFormField = <TFieldValues extends FieldValues>({
  control,
  name,
  key,
  label,
  options,
  description,
  placeholder,
  required,
  disabled,
  inputClassName,
  selectContentClassName,
  formItemClassName,
  hide = false,
  hideMessage = true,
}: Props<TFieldValues>) =>
  !hide && (
    <FormField
      control={control}
      name={name as Path<TFieldValues>}
      key={key}
      render={({ field }) => (
        <FormItem className={formItemClassName}>
          {label && (
            <RequiredFormLabel required={required}>{label}</RequiredFormLabel>
          )}
          <Select
            onValueChange={field.onChange}
            value={field.value}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger
                className={cn(
                  "w-full hover:bg-muted/15 dark:hover:bg-muted/15",
                  formControlClassName,
                  inputClassName,
                )}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className={selectContentClassName}>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          {!hideMessage && <FormMessage />}
        </FormItem>
      )}
    />
  );

export default SelectFormField;
