import React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex min-w-0 border",
        "rounded-md bg-card px-3 pt-1 pb-[5px] text-base shadow-xs transition-[color,box-shadow] dark:aria-invalid:ring-destructive/40",
        "file:h-7 file:border-0 file:bg-card file:text-sm file:font-medium disabled:pointer-events-none aria-invalid:border-destructive/50",
        "file:inline-flex disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50",
        "outline-none dark:bg-input/30 focus-visible:ring-[3px] aria-invalid:ring-destructive/50 h-9 w-full border-stone-400/50",
        className
      )}
      {...props}
    />
  );
}
