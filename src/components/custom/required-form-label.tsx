import { FormLabel } from "@/components/ui/form";
import { cn } from "@/lib/utils";

type Props = {
  children: string;
  required?: boolean;
  htmlFor?: string;
  className?: string;
};

export const RequiredFormLabel = ({
  children,
  required = false,
  htmlFor,
  className,
}: Props) => (
  <FormLabel
    htmlFor={htmlFor}
    className={cn(
      "flex items-center gap-1 text-xs font-bold text-foreground/90 ml-0.5 mb-1 data-[error=true]:text-destructive",
      className,
    )}
  >
    {children}
    {required && (
      <span className="text-destructive font-bold text-[10px]">*</span>
    )}
  </FormLabel>
);
