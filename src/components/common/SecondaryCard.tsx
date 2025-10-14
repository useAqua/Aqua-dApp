import * as React from "react";

import { cn } from "~/lib/utils";

const SecondaryCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "bg-secondary text-secondary-foreground/90 rounded-lg shadow-sm",
      className,
    )}
    {...props}
  />
));
SecondaryCard.displayName = "SecondaryCard";

const SecondaryCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
SecondaryCardHeader.displayName = "SecondaryCardHeader";

const SecondaryCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-xl leading-none font-semibold tracking-tight",
      className,
    )}
    {...props}
  />
));
SecondaryCardTitle.displayName = "SecondaryCardTitle";

const SecondaryCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-muted-foreground text-sm", className)}
    {...props}
  />
));
SecondaryCardDescription.displayName = "SecondaryCardDescription";

const SecondaryCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
SecondaryCardContent.displayName = "SecondaryCardContent";

const SecondaryCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
SecondaryCardFooter.displayName = "SecondaryCardFooter";

export {
  SecondaryCard,
  SecondaryCardHeader,
  SecondaryCardFooter,
  SecondaryCardTitle,
  SecondaryCardDescription,
  SecondaryCardContent,
};
