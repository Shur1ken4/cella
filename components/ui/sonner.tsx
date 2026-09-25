"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";
import { useTheme } from "@/lib/theme";
import {
  CircleCheck,
  Info,
  TriangleAlert,
  OctagonX,
  LoaderCircle,
} from "lucide-react";

const Toaster = (props: ToasterProps) => {
  const { theme } = useTheme();
  return (
    <Sonner
      theme={theme}
      position="bottom-right"
      className="toaster group"
      icons={{
        success: <CircleCheck className="size-4 text-green" />,
        info: <Info className="size-4 text-cyan" />,
        warning: <TriangleAlert className="size-4 text-warning" />,
        error: <OctagonX className="size-4 text-danger" />,
        loading: <LoaderCircle className="size-4 animate-spin text-cyan" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "!rounded-md !border !border-border-strong !bg-surface-1 !text-text !shadow-pop !font-sans",
          title: "!text-sm !font-medium",
          description: "!text-xs !text-text-muted",
          success: "!border-green-deep",
          error: "!border-danger/60",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
