import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { ComponentType } from "react";

interface LPChartProps {
  primaryPercentage?: number;
  accentPercentage?: number;
  primaryLabel?: string;
  accentLabel?: string;
  primaryIcon?: string;
  accentIcon?: string;
}

// Dynamically import echarts-for-react so chart is client-only and SSR-safe
const ReactECharts = dynamic(() => import("echarts-for-react"), {
  ssr: false,
}) as unknown as ComponentType<Record<string, unknown>>;

const LPChart = ({
  primaryPercentage = 49.82,
  accentPercentage = 50.17,
  primaryLabel,
  accentLabel,
  primaryIcon,
  accentIcon,
}: LPChartProps) => {
  const firstName = primaryLabel ?? "Primary";
  const secondName = accentLabel ?? "Accent";

  // Map names to icons so the tooltip formatter can pick the right icon
  const iconMap = useMemo(
    () => ({
      [firstName]: primaryIcon ?? "",
      [secondName]: accentIcon ?? "",
    }),
    [firstName, secondName, primaryIcon, accentIcon],
  );

  // ECharts option for a doughnut chart. Colors chosen to match typical primary/accent theme –
  // feel free to tweak to match your Tailwind theme variables.
  const option = useMemo(() => {
    const values = [
      { value: Number(primaryPercentage.toFixed(2)), name: firstName },
      { value: Number(accentPercentage.toFixed(2)), name: secondName },
    ];

    return {
      // Use default ECharts tooltip (near cursor). Formatter includes icon + name + percent.
      tooltip: {
        show: true,
        trigger: "item",
        formatter: (params: unknown) => {
          const p = (params as Record<string, unknown>) ?? {};
          const name =
            typeof p.name === "string"
              ? p.name
              : typeof p.name === "number"
                ? String(p.name)
                : "";
          const rawPercent = p.percent;
          let percentStr = "--";
          if (typeof rawPercent === "number")
            percentStr = rawPercent.toFixed(2);
          else if (typeof rawPercent === "string") percentStr = rawPercent;
          const icon = iconMap[String(name)] ?? "";
          return `${icon ? `${icon} ` : ""}${name}: <strong>${percentStr}%</strong>`;
        },
      },
      legend: { show: false },
      series: [
        {
          name: "LP Split",
          type: "pie",
          radius: ["70%", "88%"],
          avoidLabelOverlap: false,
          startAngle: 90,
          clockwise: true,
          label: { show: false },
          emphasis: { scale: false },
          silent: false,
          data: values,
          itemStyle: {
            borderWidth: 0,
          },
        },
      ],
      color: ["#06b6d4", "#7c3aed"],
    } as const;
  }, [primaryPercentage, accentPercentage, firstName, secondName, iconMap]);

  const fmt = (n?: number) => (typeof n === "number" ? n.toFixed(2) : "--");

  return (
    <div className="flex-1">
      <div className="relative mx-auto h-48 w-48">
        <ReactECharts
          option={option}
          style={{ height: "100%", width: "100%" }}
        />
      </div>

      <div className="mt-4 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-base">
            {primaryIcon ?? (
              <span className="bg-primary inline-block h-3 w-3 rounded-full" />
            )}
          </span>
          <span className="text-card-foreground text-sm">
            {primaryLabel ? `${primaryLabel} ` : ""}
            {fmt(primaryPercentage)}%
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-base">
            {accentIcon ?? (
              <span className="bg-accent inline-block h-3 w-3 rounded-full" />
            )}
          </span>
          <span className="text-card-foreground text-sm">
            {accentLabel ? `${accentLabel} ` : ""}
            {fmt(accentPercentage)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default LPChart;
