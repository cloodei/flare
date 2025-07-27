import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "./input";
import { cn } from "@/lib/utils";

interface PasswordInputProps extends React.ComponentProps<"input"> {
  /**
   * Callback when the visibility of the password changes
   * @param isVisible Current visibility state
   * @returns void
   */
  onVisibilityChange?: (isVisible: boolean) => void;
  /**
   * Custom class name for the toggle button
   */
  toggleClassName?: string;
  /**
   * Whether to show the toggle button
   * @default true
   */
  showToggle?: boolean;
  /**
   * Initial visibility state of the password
   * @default false
   */
  defaultVisible?: boolean;
}

function PasswordInput({
  onVisibilityChange,
  toggleClassName,
  showToggle = true,
  defaultVisible = false,
  className,
  ...props
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(defaultVisible);

  const toggleVisibility = () => {
    const newVisible = !isVisible;
    setIsVisible(newVisible);
    onVisibilityChange?.(newVisible);
  };

  return (
    <div className="relative">
      <Input
        type={isVisible ? "text" : "password"}
        className={cn("pr-10", className)}
        {...props}
      />
      {showToggle && (
        <button
          type="button"
          onClick={toggleVisibility}
          className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm",
            "disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
            toggleClassName
          )}
          disabled={props.disabled}
          tabIndex={-1}
          aria-label={isVisible ? "Hide password" : "Show password"}
        >
          {isVisible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      )}
    </div>
  );
}

export { type PasswordInputProps, PasswordInput };
