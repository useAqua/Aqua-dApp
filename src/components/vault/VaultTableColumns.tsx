import { createColumnHelper } from "@tanstack/react-table";
import type { VaultTableEntry } from "~/types";
import VaultNameCell from "./VaultNameCell";
import { formatNumber } from "~/utils/numbers";
import { Skeleton } from "~/components/ui/skeleton";

const columnHelper = createColumnHelper<VaultTableEntry>();

export const createVaultTableColumns = (
  isLoadingWallet = false,
  isLoadingDeposit = false,
) => [
  columnHelper.accessor("name", {
    header: "VAULT",
    cell: (info) => <VaultNameCell vault={info.row.original} />,
  }),
  columnHelper.accessor("walletBalanceUsd", {
    header: "WALLET",
    cell: (info) => (
      <Skeleton isLoading={isLoadingWallet} className="h-5 w-full">
        <div className="font-semibold">${formatNumber(info.getValue())}</div>
      </Skeleton>
    ),
  }),
  columnHelper.accessor("userDepositUsd", {
    header: "DEPOSIT",
    cell: (info) => (
      <Skeleton isLoading={isLoadingDeposit} className="h-5 w-full">
        <div className="font-medium">${formatNumber(info.getValue())}</div>
      </Skeleton>
    ),
  }),
  columnHelper.accessor("apy", {
    header: "APY",
    cell: (info) => <div className="font-medium">{info.getValue()}%</div>,
  }),
  columnHelper.accessor("tvlUsd", {
    header: "TVL",
    cell: (info) => (
      <div className="font-medium">${formatNumber(info.getValue())}</div>
    ),
  }),
];
