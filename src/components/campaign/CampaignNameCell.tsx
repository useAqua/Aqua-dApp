import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import type { CampaignInfo } from "~/types/contracts";
import { formatAddress } from "~/utils/formatAddress";

interface CampaignNameCellProps {
  campaign: CampaignInfo;
}

const CampaignNameCell = ({ campaign }: CampaignNameCellProps) => {
  return (
    <Link
      href={`/campaign/${campaign.id}`}
      className="flex items-center gap-3 transition-opacity hover:opacity-80"
    >
      <div className="min-w-0">
        <div className="mb-0.5 font-semibold">{campaign.name}</div>
        <Badge variant="secondary" className="text-xs">
          {formatAddress(campaign.creator)}
        </Badge>
      </div>
    </Link>
  );
};

export default CampaignNameCell;
