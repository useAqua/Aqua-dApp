import { createColumnHelper } from "@tanstack/react-table";
import type { CampaignInfo } from "~/types/contracts";
import CampaignNameCell from "./CampaignNameCell";
import { formatNumber } from "~/utils/numbers";
import { Status } from "~/components/common/Status";
import Image from "next/image";
import aaveLogo from "~/assets/aave-logo.svg";
import type { StaticImport } from "next/dist/shared/lib/get-img-props";

const columnHelper = createColumnHelper<CampaignInfo>();

const getStatusText = (active: boolean, startTime: number, endTime: number) => {
  const now = Date.now() / 1000; // current time in seconds
  if (!active) {
    return "Inactive";
  }
  if (now < startTime) {
    return "Upcoming";
  }
  if (now >= startTime && now <= endTime) {
    return "Active";
  }
  if (now > endTime) {
    return "Ended";
  }

  return "Unknown";
};

export const createCampaignTableColumns = () => [
  columnHelper.accessor("id", {
    header: "CAMPAIGN",
    cell: (info) => <CampaignNameCell campaign={info.row.original} />,
  }),
  columnHelper.accessor("active", {
    header: "STATUS",
    cell: (info) => {
      const statusText = getStatusText(
        info.getValue(),
        Number(info.row.original.startTime),
        Number(info.row.original.endTime),
      );
      return <Status text={statusText} state={statusText} className="w-max" />;
    },
  }),
  columnHelper.accessor((row) => row.vaults.length, {
    id: "vaultCount",
    header: "VAULT COUNT",
    cell: (info) => (
      <div className="font-medium">{formatNumber(info.getValue())}</div>
    ),
  }),
  columnHelper.accessor("protocolFeeBps", {
    header: "Supported Apps",
    cell: () => (
      <div className="flex w-max items-center gap-2 rounded-full bg-[#9391F7]/20 px-3 py-1.5">
        <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full">
          <Image
            src={aaveLogo as StaticImport}
            alt="Aave"
            width={24}
            height={24}
          />
        </div>
        <span className="text-xs font-semibold text-[#9391F7]">Aave</span>
      </div>
    ),
  }),
];
