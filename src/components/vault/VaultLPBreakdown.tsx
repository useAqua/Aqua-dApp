import { Card } from "~/components/ui/card";
import LPChart from "~/components/charts/LPChart";
import TokenBreakdownList from "~/components/charts/TokenBreakdownList";

const VaultLPBreakdown = () => {
  return (
    <Card className="p-6">
      <h2 className="text-card-foreground mb-6 text-xl font-bold">
        LP Breakdown
      </h2>

      <div className="mb-6 flex items-center gap-8 max-md:flex-wrap">
        <LPChart />
        <TokenBreakdownList />
      </div>
    </Card>
  );
};

export default VaultLPBreakdown;
