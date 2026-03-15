import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import type { CampaignInfo } from "~/types/contracts";

interface CampaignNameCellProps {
  campaign: CampaignInfo;
}

const CampaignNameCell = ({ campaign }: CampaignNameCellProps) => {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Link
      href={`/campaign/${campaign.id}`}
      className="flex items-center gap-3 transition-opacity hover:opacity-80"
    >
      <div className="min-w-0">
        <div className="mb-0.5 font-semibold">Campaign #{campaign.id}</div>
        <Badge variant="secondary" className="text-xs">
          {formatAddress(campaign.creator)}
        </Badge>
      </div>
    </Link>
  );
};

export default CampaignNameCell;
