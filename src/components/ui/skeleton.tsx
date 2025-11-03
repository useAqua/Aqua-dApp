import React from "react";
import { cn } from "~/lib/utils";

interface SkeletonProps {
  isLoading?: boolean;
  className?: string;
  children?: React.ReactNode;
}

function Skeleton({ isLoading = false, className, children }: SkeletonProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <div className={cn("animate-pulse rounded-sm bg-gray-500", className)}>
      {children}
    </div>
  );
}

export { Skeleton };
