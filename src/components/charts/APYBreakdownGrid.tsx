import { SecondaryCard } from "~/components/common/SecondaryCard";

interface APYBreakdownItem {
  label: string;
  value: string;
}

interface APYBreakdownGridProps {
  items?: APYBreakdownItem[];
}

const defaultItems: APYBreakdownItem[] = [
  { label: "TOTAL APY", value: "2,680%" },
  { label: "VAULT APR", value: "330.28%" },
  { label: "BOOST APR", value: "68.15%" },
];

const APYBreakdownGrid = ({ items = defaultItems }: APYBreakdownGridProps) => {
  return (
    <div className="mt-6">
      <h3 className="text-card-foreground mb-3 font-semibold">APY breakdown</h3>
      <div className="grid grid-cols-3 gap-4">
        {items.map((item) => (
          <SecondaryCard key={item.label} className="p-4">
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
