import { Card } from "~/components/ui/card";

const yieldRows = [
  { color: "bg-primary", label: "Liquidity & Operations", value: "80%" },
  { color: "bg-teal-500", label: "Your Yield Share", value: "20%" },
  { color: "bg-purple-500", label: "Yield Source", value: "Aave V3" },
  { color: "bg-blue-500", label: "Deposit Token", value: "USDC" },
];

const YieldSplitCard = () => (
  <Card className="space-y-3.5 p-5">
    <h3 className="font-redaction text-foreground text-[13px] font-bold tracking-wider uppercase">
      How your yield is split
    </h3>

    {/* progress bar */}
    <div className="bg-secondary h-2 overflow-hidden rounded-full">
      <div className="from-primary to-primary/60 h-full w-4/5 rounded-full bg-linear-to-r" />
    </div>

    <div className="text-muted-foreground flex justify-between text-xs">
      <span>
        <strong className="text-foreground">80%</strong> → Ecosystem Liquidity
      </span>
      <span>
        <strong className="text-foreground">20%</strong> → Depositors
      </span>
    </div>

    <div className="space-y-2">
      {yieldRows.map((row) => (
        <div
          key={row.label}
          className="bg-secondary/50 flex items-center justify-between rounded-lg px-3 py-2 text-[13px]"
        >
          <span className="text-muted-foreground flex items-center gap-2">
            <span className={`inline-block h-2 w-2 rounded-full ${row.color}`} />
            {row.label}
          </span>
          <strong className="text-foreground">{row.value}</strong>
        </div>
      ))}
    </div>
  </Card>
);

export default YieldSplitCard;

