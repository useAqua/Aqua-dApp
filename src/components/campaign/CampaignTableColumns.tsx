import { createColumnHelper } from "@tanstack/react-table";
import type { CampaignInfo } from "~/types/contracts";
import CampaignNameCell from "./CampaignNameCell";
import { formatNumber } from "~/utils/numbers";
import { Status } from "~/components/common/Status";

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
    cell: (info) => (
      <div className="font-medium">{Number(info.getValue())} bps</div>
      //   TODO: replace with actual supported apps count once available in API
    ),
  }),
];
