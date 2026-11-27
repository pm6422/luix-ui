import {
  FieldError,
  FieldErrors,
  FieldValues,
  UseFormReturn,
} from "react-hook-form";
import { DangerTriangleBoldDuotone } from "solar-icon-set";
import { cn } from "@/lib/utils";

export interface FormErrorsProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  error?: FieldErrors;
  title?: string;
  fieldLabels?: Record<string, string>;
  className?: string;
}

const FormErrors = <T extends FieldValues>({
  form,
  error,
  title = "Validation Errors",
  fieldLabels,
  className,
}: FormErrorsProps<T>) => {
  const formErrors =
    error && Object.keys(error).length > 0 ? error : form.formState.errors || {};
  const errorEntries = Object.entries(formErrors);

  if (errorEntries.length === 0) return null;

  const errorMessages: string[] = [];

  const extractMessages = (errs: unknown) => {
    if (typeof errs !== "object" || errs === null) return;
    Object.entries(errs as Record<string, unknown>).forEach(([key, val]) => {
      if (isFieldError(val)) {
        if (val.message) {
          errorMessages.push(
            formatErrorMessage(key, String(val.message), fieldLabels),
          );
        }
      } else if (typeof val === "object" && val !== null) {
        extractMessages(val);
      }
    });
  };

  extractMessages(formErrors);

  if (errorMessages.length === 0) return null;

  return (
    <div
      className={cn(
        "p-2.5 rounded-xl bg-destructive/5 border border-destructive/20 animate-in fade-in slide-in-from-top-2 duration-300",
        className,
      )}
    >
      <div className="flex items-center gap-2 mb-1.5 text-destructive">
        <DangerTriangleBoldDuotone size={18} className="shrink-0" />
        <h5 className="text-xs font-bold uppercase tracking-wider">{title}</h5>
      </div>

      <div className="space-y-1.5 ml-1">
        {errorMessages.map((msg, index) => (
          <div
            key={index}
            className="flex items-center gap-2 text-xs font-medium text-destructive/90 group"
          >
            <div className="size-1 rounded-full bg-destructive/40 shrink-0 group-hover:bg-destructive transition-colors" />
            <span className="leading-tight">{msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

function isFieldError(error: unknown): error is FieldError {
  return typeof error === "object" && error !== null && "message" in error;
}

function formatErrorMessage(
  key: string,
  message: string,
  fieldLabels?: Record<string, string>,
): string {
  if (!key || !message) return message || "";

  if (message.toLowerCase() === "required") {
    const fieldLabel =
      fieldLabels?.[key] ??
      (key === "id"
        ? "ID"
        : key
            .replace(/([A-Z])/g, " $1")
            .replace(/_/g, " ")
            .trim()
            .replace(/^./, (str) => str.toUpperCase()));

    return `${fieldLabel} is required`;
  }

  return message;
}

export default FormErrors;
