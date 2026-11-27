import { useId, useState, ReactNode } from "react";
import { DialogClose } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { FieldErrors, FieldValues, UseFormReturn } from "react-hook-form";
import FormErrors from "@/components/custom/dialog/form-errors";
import {
  BaseDialog,
  type BaseDialogSize,
} from "@/components/custom/dialog/base-dialog";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/custom/loading-button";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/handle-error";

export interface FormDialogProps<T extends FieldValues> {
  children: ReactNode;
  entityName: string;
  id?: string | number | null;
  form: UseFormReturn<T>;
  title?: string;
  description?: string;
  size?: BaseDialogSize;
  className?: string;
  save?: (formData: T) => Promise<unknown>;
  afterSave?: (success: boolean) => void;
  setOpen: (open: boolean) => void;
  submitText?: string;
  loadingText?: string;
  cancelText?: string;
  savingToastText?: string;
  savedToastText?: string;
  formatError?: (err: unknown) => string;
  fieldLabels?: Record<string, string>;
  readonly?: boolean;
  debug?: boolean;
  customError?: FieldErrors;
  submitDisabled?: boolean;
  showCloseButton?: boolean;
}

const FormDialog = <T extends FieldValues>({
  children,
  entityName,
  id,
  form,
  title,
  description,
  size = "md",
  className,
  save,
  afterSave,
  setOpen,
  submitText,
  loadingText,
  cancelText = "Cancel",
  savingToastText,
  savedToastText,
  formatError = getErrorMessage,
  fieldLabels,
  readonly = false,
  debug = false,
  customError,
  submitDisabled = false,
  showCloseButton = true,
}: FormDialogProps<T>) => {
  const [saving, setSaving] = useState(false);
  const formId = useId();

  function onSubmit(formData: T): void {
    if (!save) return;
    setSaving(true);
    toast.promise(save(formData), {
      loading: savingToastText ?? `Saving ${entityName}...`,
      success: (data) => {
        setOpen(false);
        if (!id) form.reset();
        afterSave?.(true);
        setSaving(false);
        return typeof data === "string"
          ? data
          : (savedToastText ?? `Successfully saved ${entityName}`);
      },
      error: (err) => {
        afterSave?.(false);
        setSaving(false);
        return formatError(err);
      },
    });
  }

  const resolvedTitle =
    title || `${readonly ? "View" : id ? "Edit" : "Add"} ${entityName}`;
  const resolvedSubmitLabel = saving
    ? (loadingText ?? (submitText ? `${submitText}...` : "Saving"))
    : (submitText ?? "Save");

  return (
    <BaseDialog
      title={resolvedTitle}
      description={description}
      size={size}
      className={className}
      headerClassName="px-6 py-4 pr-12"
      titleClassName="capitalize text-base md:text-lg"
      contentClassName="px-6 py-4 flex flex-col gap-4"
      footerClassName="px-6 py-3"
      showCloseButton={showCloseButton}
      footer={
        <>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={saving}>
              {cancelText}
            </Button>
          </DialogClose>
          {!readonly && (
            <LoadingButton
              type="submit"
              form={formId}
              loading={saving}
              disabled={submitDisabled}
              className="min-w-[80px]"
            >
              {resolvedSubmitLabel}
            </LoadingButton>
          )}
        </>
      }
    >
      <Form {...form}>
        <form
          id={formId}
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormErrors
            form={form}
            error={customError}
            fieldLabels={fieldLabels}
          />

          <div className="flex flex-col gap-3">{children}</div>

          {debug && (
            <pre className="mt-2 rounded-md bg-slate-950 p-4 overflow-x-auto text-[10px]">
              <code className="text-rose-500">
                {JSON.stringify(form.getValues(), null, 2)}
              </code>
            </pre>
          )}
        </form>
      </Form>
    </BaseDialog>
  );
};

export default FormDialog;
