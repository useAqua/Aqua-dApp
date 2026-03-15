import { createColumnHelper } from "@tanstack/react-table";
import type { CampaignInfo } from "~/types/contracts";
import CampaignNameCell from "./CampaignNameCell";
import { formatNumber } from "~/utils/numbers";

const columnHelper = createColumnHelper<CampaignInfo>();

export const createCampaignTableColumns = () => [
  columnHelper.accessor("id", {
    header: "CAMPAIGN",
    cell: (info) => <CampaignNameCell campaign={info.row.original} />,
  }),
  columnHelper.accessor("active", {
    header: "STATUS",
    cell: (info) => (
      <span className="font-medium">
        {info.getValue() ? "Active" : "Inactive"}
      </span>
    ),
  }),
  columnHelper.accessor((row) => row.vaults.length, {
    id: "vaultCount",
    header: "VAULT COUNT",
    cell: (info) => (
      <div className="font-medium">{formatNumber(info.getValue())}</div>
    ),
  }),
  columnHelper.accessor("protocolFeeBps", {
    header: "PROTOCOL FEE",
    cell: (info) => (
      <div className="font-medium">{Number(info.getValue())} bps</div>
    ),
  }),
];
