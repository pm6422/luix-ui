import { useTheme } from "@/components/theme-provider";
import { Toaster as Sonner } from "sonner";
import {
  CheckCircleBoldDuotone,
  DangerTriangleBoldDuotone,
  InfoCircleBoldDuotone,
} from "solar-icon-set";

type ToasterProps = React.ComponentProps<typeof Sonner>;

function Toaster({ ...props }: ToasterProps) {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-left"
      offset={16}
      icons={{
        success: <CheckCircleBoldDuotone size={19} className="shrink-0 text-emerald-500 dark:text-emerald-400" />,
        error: <DangerTriangleBoldDuotone size={19} className="shrink-0 text-rose-500 dark:text-rose-400" />,
        info: <InfoCircleBoldDuotone size={19} className="shrink-0 text-blue-500 dark:text-blue-400" />,
        warning: <DangerTriangleBoldDuotone size={19} className="shrink-0 text-amber-500 dark:text-amber-400" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast ios-glass-toast group-[.toaster]:rounded-full group-[.toaster]:px-4 group-[.toaster]:py-2 font-sans",
          title: "text-xs font-semibold tracking-tight",
          description: "text-[11px] font-normal tracking-tight",
          actionButton:
            "rounded-full text-[11px] font-medium px-3 py-1 border border-border/40 bg-muted/40 text-foreground hover:bg-muted/70 transition-all",
          cancelButton:
            "rounded-full text-[11px] font-medium px-3 py-1 text-muted-foreground hover:text-foreground transition-all",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
