import React from "react";
import { cn } from "~/lib/utils";

interface SkeletonProps {
  isLoading?: boolean;
  children: React.ReactNode;
  className?: string;
}

function Skeleton({ isLoading = false, children, className }: SkeletonProps) {
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
    <div className={cn("animate-pulse rounded-sm bg-gray-500", className)} />
  );
}

export { Skeleton };
