import { Badge } from "~/components/ui/badge";
import Link from "next/link";
import { Card } from "~/components/ui/card";

interface VaultRowProps {
  id: string;
  name: string;
  protocol: string;
  icon: string;
  boost?: boolean;
  atDeposit: string;
  atDepositUsd: string;
  now: string;
  nowUsd: string;
  yield: string;
  yieldUsd: string;
  pnl: string;
  pnlPercent: string;
  apy: string;
  apyPercent: string;
  dailyYield: string;
}

const VaultRow = ({
  id,
  name,
  protocol,
  icon,
  boost,
  atDeposit,
  atDepositUsd,
  now,
  nowUsd,
  yield: yieldValue,
  yieldUsd,
  pnl,
  pnlPercent,
  apy,
  // apyPercent,
  dailyYield,
}: VaultRowProps) => {
  return (
    <Link href={`/vault/${id}`}>
      <Card className="hover:border-primary/50 grid grid-cols-[1fr,repeat(5,minmax(100px,1fr))] items-center gap-4 p-4 transition-all hover:shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-secondary flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg">
            {icon}
          </div>
          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-2">
              <span className="text-card-foreground truncate font-semibold">
                {name}
              </span>
              {boost && (
                <Badge
                  variant="secondary"
                  className="border-yellow-500/30 bg-yellow-500/20 text-xs text-yellow-500"
                >
                  BOOST 🔥
                </Badge>
              )}
            </div>
            <span className="text-card-foreground/70 text-sm">{protocol}</span>
          </div>
        </div>

        <div className="text-right">
          <div className="text-card-foreground font-semibold">{atDeposit}</div>
          <div className="text-card-foreground/70 text-sm">{atDepositUsd}</div>
        </div>

        <div className="text-right">
          <div className="text-card-foreground font-semibold">{now}</div>
          <div className="text-card-foreground/70 text-sm">{nowUsd}</div>
        </div>

        <div className="text-right">
          <div className="font-semibold text-green-400">{yieldValue}</div>
          <div className="text-card-foreground/70 text-sm">{yieldUsd}</div>
        </div>

        <div className="text-right">
          <div
            className={`font-semibold ${pnl.startsWith("+") ? "text-green-400" : pnl.startsWith("-") ? "text-red-400" : "text-card-foreground"}`}
          >
            {pnl}
          </div>
          <div
            className={`text-sm ${pnlPercent.startsWith("+") ? "text-green-400" : pnlPercent.startsWith("-") ? "text-red-400" : "text-card-foreground/70"}`}
          >
            {pnlPercent}
          </div>
        </div>

        <div className="text-right">
          <div className="font-semibold text-green-400">{apy}</div>
          <div className="text-card-foreground/70 text-sm">{dailyYield}</div>
        </div>
      </Card>
    </Link>
  );
};

export default VaultRow;
