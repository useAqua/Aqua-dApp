import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import type { CampaignInfo } from "~/types/contracts";
import { formatNumber } from "~/utils/numbers";
import { formatAddress } from "~/utils/formatAddress";

interface CampaignMobileCardProps {
  campaign: CampaignInfo;
}

const CampaignMobileCard = ({ campaign }: CampaignMobileCardProps) => {
  return (
    <Link
      href={`/campaign/${campaign.id}`}
      className="bg-card hover:bg-primary/10 border-border/50 block border-b px-6 py-8 transition-colors first:rounded-t-lg last:rounded-b-lg"
    >
      {/* Campaign Header */}
      <div className="mb-4 flex items-center gap-3 border-b border-border/30 pb-4">
        <div className="min-w-0 flex-1">
          <div className="mb-1 font-semibold">Campaign #{campaign.id}</div>
          <Badge variant="secondary" className="text-xs">
            {formatAddress(campaign.creator)}
          </Badge>
        </div>
      </div>

      {/* Campaign Data Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-muted-foreground mb-1 text-xs uppercase">
            STATUS
          </div>
          <div className="font-semibold">
            {campaign.active ? "Active" : "Inactive"}
          </div>
        </div>
        <div>
          <div className="text-muted-foreground mb-1 text-xs uppercase">
            VAULT COUNT
          </div>
          <div className="font-medium">
            {formatNumber(campaign.vaults.length)}
          </div>
        </div>
        <div>
          <div className="text-muted-foreground mb-1 text-xs uppercase">
            PROTOCOL FEE
          </div>
          <div className="font-medium">
            {Number(campaign.protocolFeeBps)} bps
          </div>
        </div>
        <div>
          <div className="text-muted-foreground mb-1 text-xs uppercase">
            PHASE DURATION
          </div>
          <div className="font-medium">
            {Number(campaign.phaseDuration)} days
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CampaignMobileCard;
