// Utilities
export { cn, toBase64 } from "@/lib/utils";
export { getErrorMessage } from "@/lib/handle-error";
export {
  formatDateTime,
  DEFAULT_TIME_ZONE,
  DEFAULT_DATE_FORMAT,
  DEFAULT_TIME_FORMAT,
  DEFAULT_DATE_TIME_FORMAT,
} from "@/lib/date-time";

// Theme & Feedback
export {
  ThemeProvider,
  useTheme,
  type Theme,
  type ThemeProviderProps,
} from "@/components/theme-provider";
export { Toaster } from "@/components/custom/toaster";
export { InlineLoading } from "@/components/custom/inline-loading";
export { default as RouteLoading } from "@/components/custom/route-loading";

// Custom High-Level Components
export {
  BackButton,
  getBackButtonClassName,
  type BackButtonProps,
  type BackButtonVariant,
} from "@/components/custom/back-button";
export {
  DateTimeDisplay,
  type DateTimeDisplayProps,
} from "@/components/custom/date-time-display";
export {
  ConfirmDialog,
  type ConfirmDialogProps,
  type ConfirmVariant,
} from "@/components/custom/confirm-dialog";
export { ConfirmPopover } from "@/components/custom/confirm-popover";
export {
  LoadingButton,
  type LoadingButtonProps,
} from "@/components/custom/loading-button";
export {
  NumericStepperInput,
  type NumericStepperInputProps,
} from "@/components/custom/numeric-stepper-input";
export { DetailCard } from "@/components/custom/detail-card";
export { RequiredFormLabel } from "@/components/custom/required-form-label";
export {
  default as MultiSelect,
  type Option as SelectOption,
} from "@/components/custom/multi-select";
export {
  SimpleTable,
  type SimpleColumn,
  type SimpleTableProps,
  type ServerPagination,
} from "@/components/custom/simple-table";

// Dialog System
export {
  BaseDialog,
  type BaseDialogProps,
  type BaseDialogSize,
} from "@/components/custom/dialog/base-dialog";
export {
  default as FormDialog,
  type FormDialogProps,
} from "@/components/custom/dialog/form-dialog";
export {
  default as FormErrors,
  type FormErrorsProps,
} from "@/components/custom/dialog/form-errors";

// Form Fields
export { formControlClassName } from "@/components/custom/form-field/control-styles";
export { default as FormFieldInput } from "@/components/custom/form-field/input";
export { default as FormFieldSelect } from "@/components/custom/form-field/select";
export { default as FormFieldSwitch } from "@/components/custom/form-field/switch";
export { default as FormFieldCombobox } from "@/components/custom/form-field/combobox";
export { default as FormFieldMultiSelect } from "@/components/custom/form-field/multi-select";

// Base UI Primitives (shadcn/ui)
export * from "@/components/ui/action-bar";
export * from "@/components/ui/alert";
export * from "@/components/ui/alert-dialog";
export * from "@/components/ui/avatar";
export * from "@/components/ui/badge";
export * from "@/components/ui/button";
export * from "@/components/ui/card";
export * from "@/components/ui/checkbox";
export * from "@/components/ui/collapsible";
export * from "@/components/ui/command";
export * from "@/components/ui/context-menu";
export * from "@/components/ui/dialog";
export * from "@/components/ui/dropdown-menu";
export * from "@/components/ui/form";
export * from "@/components/ui/input";
export * from "@/components/ui/input-group";
export * from "@/components/ui/label";
export * from "@/components/ui/pagination";
export * from "@/components/ui/popover";
export * from "@/components/ui/progress";
export * from "@/components/ui/radio-group";
export * from "@/components/ui/scroll-area";
export * from "@/components/ui/select";
export * from "@/components/ui/separator";
export * from "@/components/ui/sheet";
export * from "@/components/ui/sidebar";
export * from "@/components/ui/skeleton";
export * from "@/components/ui/switch";
export * from "@/components/ui/table";
export * from "@/components/ui/tabs";
export * from "@/components/ui/textarea";
export * from "@/components/ui/tooltip";
