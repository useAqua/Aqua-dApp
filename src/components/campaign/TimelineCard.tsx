import { useMemo } from "react";
import { Card } from "~/components/ui/card";
import type { CampaignInfo } from "~/types/contracts";
import {
  getCurrentPhase,
  getTotalPhases,
} from "~/components/campaign/campaignUtils";

interface TimelineCardProps {
  campaign: CampaignInfo;
}

type StepState = "done" | "active" | "upcoming";

interface TimelineStep {
  step: number;
  title: string;
  desc: string;
  state: StepState;
}

const PHASE_TITLES: Record<number, string> = {
  1: "Phase 1 — Pre-deposit Opens",
  2: "Phase 2 — Additional Integrations",
};

const PHASE_DESCS: Record<number, string> = {
  1: "Deposit USDC. Your yield accrues via Aave and splits 80/20 — seeding the liquidity you'll benefit from at launch.",
  2: "More yield sources unlocked (Morpho, Compound). Better rates, deeper ecosystem bootstrapping.",
};

const TimelineCard = ({ campaign }: TimelineCardProps) => {
  const currentPhase = getCurrentPhase(campaign);
  const totalPhases = getTotalPhases(campaign);
  const hasEnded = Date.now() > Number(campaign.endTime) * 1000;

  const steps = useMemo((): TimelineStep[] => {
    const items: TimelineStep[] = [];

    const definedPhases = Math.max(
      totalPhases,
      Object.keys(PHASE_TITLES).length,
    );

    for (let i = 1; i <= definedPhases; i++) {
      items.push({
        step: i,
        title: PHASE_TITLES[i] ?? `Phase ${i}`,
        desc:
          PHASE_DESCS[i] ??
          `Phase ${i} — additional integrations and deeper ecosystem bootstrapping.`,
        state:
          hasEnded || i < currentPhase
            ? "done"
            : i === currentPhase
              ? "active"
              : "upcoming",
      });
    }

    items.push({
      step: totalPhases + 1,
      title: "Mainnet Launch",
      desc: "Full principal returned. Protocol tokens distributed to depositors. The liquidity you seeded is live — and you're a day-one participant.",
      state: hasEnded ? "done" : "upcoming",
    });

    return items;
  }, [currentPhase, totalPhases, hasEnded]);

  return (
    <Card className="p-5">
      <h3 className="font-redaction text-foreground mb-4 text-sm font-bold tracking-wider uppercase">
        Campaign Timeline
      </h3>
      <div className="flex flex-col">
        {steps.map((s, i) => (
          <div key={s.step} className="relative flex gap-3.5">
            {/* connector line */}
            {i < steps.length - 1 && (
              <div className="border-border absolute top-5 left-2.25 h-[calc(100%+4px)] w-0.5 border-l-2" />
            )}

            {/* dot */}
            <div className="z-10 flex shrink-0 items-start pt-0.5">
              <div
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                  s.state === "done"
                    ? "bg-teal-500 text-white"
                    : s.state === "active"
                      ? "bg-primary ring-primary/20 text-white ring-[3px]"
                      : "bg-muted/60 text-muted-foreground border-border border"
                }`}
              >
                {s.state === "done" ? "✓" : s.step}
              </div>
            </div>

            {/* content */}
            <div className="min-w-0 flex-1 pb-5">
              <div className="mb-0.5 flex items-start gap-2">
                <p className="text-foreground flex flex-wrap items-center gap-1.5 text-sm font-semibold">
                  {s.title}
                  {s.state === "active" && (
                    <span className="bg-primary/10 text-primary border-primary/20 inline-block rounded-full border px-1.5 py-0.5 text-[10px] leading-none font-semibold">
                      Active
                    </span>
                  )}
                  {s.state === "done" && (
                    <span className="inline-block rounded-full border border-teal-500/20 bg-teal-500/10 px-1.5 py-0.5 text-[10px] leading-none font-semibold text-teal-600">
                      Complete
                    </span>
                  )}
                </p>
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed">
                {s.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TimelineCard;
