import { type FC, type ReactNode } from "react";
import { cn } from "~/lib/utils";
import { Skeleton } from "~/components/ui/skeleton";

interface MetricCardProps {
  label: string;
  value: string | number | ReactNode;
  subValue?: string;
  Icon?: FC;
  helpIcon?: boolean;
  className?: string;
  valueColor?: "default" | "accent" | "green" | "red" | "white";
  children?: ReactNode;
  type?: "bare" | "card" | "incard";
  isLoading?: boolean;
}

const MetricCard = ({
  label,
  value,
  subValue,
  Icon,
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
      case "white":
        return "text-white";
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
            "rounded-lg bg-white/15 p-4 text-white": type === "incard",
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
          "border-border/10 rounded-lg border bg-white/15 p-3 text-white":
            type === "incard",
        },
        className,
      )}
    >
      <div className={cn("grid w-full")}>
        {Icon && (
          <div className="text-card-foreground/70 mb-4 h-8 w-8">
            <Icon />
          </div>
        )}
        <div className="flex items-center gap-2">
          {" "}
          <span
            className={cn(
              "text-card-foreground/70 flex-1 text-xs font-medium uppercase",
              { "text-white/50": type === "incard" },
            )}
          >
            {label}
          </span>
          {helpIcon && (
            <div className="border-card-foreground/70 flex h-4 w-4 items-center justify-center rounded-full border">
              <span className="text-card-foreground/70 text-[10px]">?</span>
            </div>
          )}
        </div>
      </div>

      {children ?? (
        <>
          <p
            className={cn(
              "mt-1 text-lg font-bold md:text-2xl",
              getValueColorClass(),
              { "mt-0.5 text-xl md:text-xl": type === "incard" },
            )}
          >
            {value}
          </p>
          {subValue && (
            <p className="text-card-foreground/70 text-xs">{subValue}</p>
          )}
        </>
      )}
    </div>
  );
};

export default MetricCard;
