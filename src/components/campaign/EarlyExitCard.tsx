import { Card } from "~/components/ui/card";

const earlyExitRows = [
  { label: "Exit penalty", value: "Forfeit 100% accrued yield" },
  { label: "Principal fee", value: "1% of deposited amount" },
  { label: "Example ($10,000 after 2mo)", value: "You receive $9,900" },
];

const EarlyExitCard = () => (
  <Card className="space-y-2 p-5">
    <h3 className="font-redaction text-foreground text-[13px] font-bold tracking-wider uppercase">
      Early Exit Mechanics
    </h3>
    <div className="space-y-2">
      {earlyExitRows.map((row) => (
        <div
          key={row.label}
          className="bg-secondary/50 flex items-center justify-between rounded-lg px-3 py-2 text-[13px]"
        >
          <span className="text-muted-foreground">{row.label}</span>
          <strong className="text-foreground text-right">{row.value}</strong>
        </div>
      ))}
    </div>
  </Card>
);

export default EarlyExitCard;

