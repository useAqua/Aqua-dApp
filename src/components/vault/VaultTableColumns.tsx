import { createColumnHelper } from "@tanstack/react-table";
import type { Vault } from "~/types";
import VaultNameCell from "./VaultNameCell";

const columnHelper = createColumnHelper<Vault>();

export const vaultTableColumns = [
  columnHelper.accessor("name", {
    header: "VAULT",
    cell: (info) => <VaultNameCell vault={info.row.original} />,
  }),
  columnHelper.accessor("wallet", {
    header: "WALLET",
    cell: (info) => <div className="font-semibold">{info.getValue()}</div>,
  }),
  columnHelper.accessor("deposit", {
    header: "DEPOSIT",
    cell: (info) => <div className="font-medium">{info.getValue()}</div>,
  }),
  columnHelper.accessor("apy", {
    header: "APY",
    cell: (info) => <div className="font-medium">{info.getValue()}</div>,
  }),
  columnHelper.accessor("tvl", {
    header: "TVL",
    cell: (info) => <div className="font-medium">{info.getValue()}</div>,
  }),
];
