import { type ReactNode } from "react";
import { type LucideIcon } from "lucide-react";
import { cn } from "~/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: LucideIcon;
  helpIcon?: boolean;
  className?: string;
  valueColor?: "default" | "accent" | "green" | "red";
  children?: ReactNode;
  type?: "bare" | "card";
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

  return (
    <div
      className={cn(
        "text-card-foreground",
        {
          "bg-card rounded-lg p-4 shadow-[var(--shadow-card)]": type === "card",
        },
        className,
      )}
    >
      <div className="mb-2 flex w-full items-center gap-2">
        {Icon && <Icon className="text-card-foreground/70 h-4 w-4" />}
        <span className="text-card-foreground/70 flex-1 text-sm">{label}</span>
        {helpIcon && (
          <div className="border-card-foreground/70 flex h-3 w-3 items-center justify-center rounded-full border">
            <span className="text-card-foreground/70 text-xs">?</span>
          </div>
        )}
      </div>

      {children ?? (
        <>
          <p className={`text-3xl font-bold ${getValueColorClass()}`}>
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
