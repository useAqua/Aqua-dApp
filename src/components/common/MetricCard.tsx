import { type ReactNode } from "react";
import { type LucideIcon } from "lucide-react";
import { cn } from "~/lib/utils";
import { Skeleton } from "~/components/ui/skeleton";

interface MetricCardProps {
  label: string;
  value: string | number | ReactNode;
  subValue?: string;
  icon?: LucideIcon;
  helpIcon?: boolean;
  className?: string;
  valueColor?: "default" | "accent" | "green" | "red";
  children?: ReactNode;
  type?: "bare" | "card";
  isLoading?: boolean;
}

const MetricCard = ({
  label,
  value,
  subValue,
  icon: Icon,
  helpIcon = false,
  className = "",
  valueColor = "default",
  children,
  type = "bare",
  isLoading = false,
}: MetricCardProps) => {
  const getValueColorClass = () => {
    switch (valueColor) {
      case "accent":
        return "text-accent";
      case "green":
        return "text-green-400";
      case "red":
        return "text-red-400";
      default:
        return "text-card-foreground";
    }
  };

  if (isLoading) {
    return (
      <div
        className={cn(
          "text-card-foreground",
          {
            "bg-card border-border/30 rounded-lg border p-4 shadow-[var(--shadow-card)]":
              type === "card",
          },
          className,
        )}
      >
        <Skeleton isLoading className="mb-2 h-4 w-24" />
        <Skeleton isLoading className="h-8 w-32" />
        {subValue && <Skeleton isLoading className="mt-1 h-3 w-20" />}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "text-card-foreground",
        {
          "bg-card border-border/30 rounded-lg border p-4 shadow-[var(--shadow-card)]":
            type === "card",
        },
        className,
      )}
    >
      <div className="mb-2 flex w-full items-center gap-2">
        {Icon && <Icon className="text-card-foreground/70 h-4 w-4" />}
        <span className="text-card-foreground/70 flex-1 text-sm font-medium md:text-xs">
          {label}
        </span>
        {helpIcon && (
          <div className="border-card-foreground/70 flex h-4 w-4 items-center justify-center rounded-full border">
            <span className="text-card-foreground/70 text-[10px]">?</span>
          </div>
        )}
      </div>

      {children ?? (
        <>
          <p
            className={`text-lg font-bold md:text-2xl ${getValueColorClass()}`}
          >
            {value}
          </p>
          {subValue && (
            <p className="text-card-foreground/70 mt-1 text-xs">{subValue}</p>
          )}
        </>
      )}
    </div>
  );
};

export default MetricCard;
