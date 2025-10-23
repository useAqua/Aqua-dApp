import { SecondaryCard } from "~/components/common/SecondaryCard";
import type { ReactNode } from "react";

interface APYBreakdownItem {
  label: string;
  value: ReactNode;
}

interface APYBreakdownGridProps {
  items?: APYBreakdownItem[];
}

const APYBreakdownGrid = ({ items }: APYBreakdownGridProps) => {
  return (
    <div className="mt-6">
      <h3 className="text-card-foreground mb-3 font-semibold">APY breakdown</h3>
      <div className="flex justify-between gap-4 max-md:flex-wrap">
        {items?.map((item) => (
          <SecondaryCard key={item.label} className="flex-1 p-4">
            <p className="text-secondary-foreground/70 mb-1 text-xs">
              {item.label}
            </p>
            <p className="text-xl font-bold">{item.value}</p>
          </SecondaryCard>
        ))}
      </div>
    </div>
  );
};

export default APYBreakdownGrid;
