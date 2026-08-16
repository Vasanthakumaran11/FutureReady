import { useTheme } from "@/hooks/useTheme";
import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
  const { resolvedTheme } = useTheme();

  return (
    <Sonner
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-surface group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-raised group-[.toaster]:rounded-[8px] group-[.toaster]:text-sm group-[.toaster]:font-medium group-[.toaster]:border-l-[3px] group-[.toaster]:border-l-accent",
          description: "group-[.toast]:text-muted-foreground group-[.toast]:text-xs",
          actionButton:
            "group-[.toast]:bg-accent group-[.toast]:text-accent-foreground group-[.toast]:rounded-[6px] group-[.toast]:text-xs",
          cancelButton:
            "group-[.toast]:bg-surface-hover group-[.toast]:text-muted-foreground group-[.toast]:rounded-[6px] group-[.toast]:text-xs",
          success: "group-[.toaster]:border-l-success",
          error: "group-[.toaster]:border-l-destructive",
          warning: "group-[.toaster]:border-l-warning",
          info: "group-[.toaster]:border-l-info",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
