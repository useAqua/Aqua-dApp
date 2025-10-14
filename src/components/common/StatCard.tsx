import type { LucideIcon } from "lucide-react";
import { Card } from "~/components/ui/card";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  subValue?: string;
}

const StatCard = ({ icon: Icon, label, value, subValue }: StatCardProps) => {
  return (
    <Card className="p-6 bg-card hover:border-primary/50 transition-colors text-card-foreground shadow-[var(--shadow-card)] hover:shadow-lg">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-card-foreground/70 mb-1">{label}</p>
          <p className="text-2xl font-bold text-card-foreground">{value}</p>
          {subValue && (
            <p className="text-xs text-card-foreground/70 mt-1">{subValue}</p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
