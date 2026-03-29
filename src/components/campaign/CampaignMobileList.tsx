import { type Table as TableType } from "@tanstack/react-table";
import CampaignMobileCard from "./CampaignMobileCard";
import type { CampaignInfo } from "~/types/contracts";
import { Card } from "~/components/ui/card";

interface CampaignMobileListProps {
  table: TableType<CampaignInfo>;
}

const CampaignMobileList = ({ table }: CampaignMobileListProps) => {
  return (
    <Card className="md:hidden">
      {table.getRowModel().rows.map((row) => (
        <CampaignMobileCard key={row.id} campaign={row.original} />
      ))}
    </Card>
  );
};

export default CampaignMobileList;
