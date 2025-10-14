import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/lib/utils";

const inputVariants = cva(
  [
    "flex h-10 w-full",
    "rounded-md border",
    "px-3 py-2",
    "text-sm",
    "file:text-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium",
    "focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-none",
    "ring-offset-background",
    "disabled:cursor-not-allowed disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-background border-input",
          "text-foreground",
          "placeholder:text-muted-foreground",
          "focus-visible:ring-border",
        ],
        secondary: [
          "bg-secondary border-input",
          "text-secondary-foreground",
          "placeholder:text-secondary-foreground/50",
          "focus-visible:ring-ring",
        ],
        error: [
          "bg-background border-destructive",
          "text-destructive",
          "placeholder:text-destructive/50",
          "focus-visible:ring-destructive",
        ],
        success: [
          "bg-background border-green-500",
          "text-green-700 dark:text-green-400",
          "placeholder:text-green-500/50",
          "focus-visible:ring-green-500",
        ],
        ghost: [
          "bg-transparent border-transparent",
          "text-foreground",
          "placeholder:text-muted-foreground/50",
          "focus-visible:ring-ring focus-visible:bg-background",
        ],
      },
      inputSize: {
        default: "h-10 px-3 py-2",
        sm: "h-8 px-2 py-1 text-sm",
        lg: "h-12 px-4 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
    },
  },
);

export interface InputProps
  extends Omit<React.ComponentProps<"input">, "size">,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, inputSize, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, inputSize }), className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
