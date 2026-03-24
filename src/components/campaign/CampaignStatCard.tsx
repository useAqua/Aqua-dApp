import { HelpCircle } from "lucide-react";
import { type ReactNode } from "react";
import { Card } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

interface CampaignStatCardProps {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  valueClassName?: string;
  isLoading?: boolean;
  helpIcon?: boolean;
}

const CampaignStatCard = ({
  label,
  value,
  sub,
  valueClassName,
  isLoading,
  helpIcon,
}: CampaignStatCardProps) => (
  <Card className="p-4">
    <p className="text-muted-foreground mb-1 flex items-center gap-1 text-[10px] font-semibold tracking-wider uppercase">
      {label}
      {helpIcon && <HelpCircle className="h-3 w-3" />}
    </p>
    {isLoading ? (
      <Skeleton isLoading className="h-6 w-20" />
    ) : (
      <p
        className={`font-redaction text-lg font-bold leading-tight ${valueClassName ?? "text-foreground"}`}
      >
        {value}
      </p>
    )}
    {sub && (
      <p className="text-muted-foreground mt-0.5 text-[11px]">{sub}</p>
    )}
  </Card>
);

export default CampaignStatCard;

