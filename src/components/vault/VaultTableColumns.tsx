import { createColumnHelper } from "@tanstack/react-table";
import type { VaultTableEntry } from "~/types";
import VaultNameCell from "./VaultNameCell";

const columnHelper = createColumnHelper<VaultTableEntry>();

export const vaultTableColumns = [
  columnHelper.accessor("name", {
    header: "VAULT",
    cell: (info) => <VaultNameCell vault={info.row.original} />,
  }),
  columnHelper.accessor("walletBalanceUsd", {
    header: "WALLET",
    cell: (info) => <div className="font-semibold">{info.getValue()}</div>,
  }),
  columnHelper.accessor("userDepositUsd", {
    header: "DEPOSIT",
    cell: (info) => <div className="font-medium">{info.getValue()}</div>,
  }),
  columnHelper.accessor("apy", {
    header: "APY",
    cell: (info) => <div className="font-medium">{info.getValue()}</div>,
  }),
  columnHelper.accessor("tvlUsd", {
    header: "TVL",
    cell: (info) => <div className="font-medium">{info.getValue()}</div>,
  }),
];
