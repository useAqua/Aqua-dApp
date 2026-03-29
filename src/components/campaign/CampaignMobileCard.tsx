import Link from "next/link";
import type { CampaignInfo } from "~/types/contracts";
import { formatNumber } from "~/utils/numbers";
import Image from "next/image";
import aaveLogo from "~/assets/aave-logo.svg";
import CampaignNameCell from "~/components/campaign/CampaignNameCell";
import { Status } from "~/components/common/Status";
import type { StaticImport } from "next/dist/shared/lib/get-img-props";

interface CampaignMobileCardProps {
  campaign: CampaignInfo;
}

const getStatusText = (active: boolean, startTime: number, endTime: number) => {
  const now = Date.now() / 1000;
  if (!active) return "Inactive";
  if (now < startTime) return "Upcoming";
  if (now >= startTime && now <= endTime) return "Active";
  if (now > endTime) return "Ended";
  return "Unknown";
};

const CampaignMobileCard = ({ campaign }: CampaignMobileCardProps) => {
  const statusText = getStatusText(
    campaign.active,
    Number(campaign.startTime),
    Number(campaign.endTime),
  );

  return (
    <Link
      href={`/campaign/${campaign.id}`}
      className="bg-card hover:bg-primary/10 border-border/50 block border-b px-6 py-8 transition-colors first:rounded-t-lg last:rounded-b-lg"
    >
      {/* Campaign Header — matches "CAMPAIGN" column */}
      <div className="border-border/30 mb-4 border-b pb-4">
        <CampaignNameCell campaign={campaign} />
      </div>

      {/* Campaign Data Grid — matches STATUS / VAULT COUNT / Supported Apps columns */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-muted-foreground mb-1 text-xs uppercase">STATUS</div>
          <Status text={statusText} state={statusText} className="w-max" />
        </div>
        <div>
          <div className="text-muted-foreground mb-1 text-xs uppercase">VAULT COUNT</div>
          <div className="font-medium">{formatNumber(campaign.vaults.length)}</div>
        </div>
        <div className="col-span-2">
          <div className="text-muted-foreground mb-2 text-xs uppercase">SUPPORTED APPS</div>
          <div className="flex w-max items-center gap-2 rounded-full bg-[#9391F7]/20 px-3 py-1.5">
            <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full">
              <Image src={aaveLogo as StaticImport} alt="Aave" width={24} height={24} />
            </div>
            <span className="text-xs font-semibold text-[#9391F7]">Aave</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CampaignMobileCard;
