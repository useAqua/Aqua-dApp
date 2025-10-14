interface LPChartProps {
  primaryPercentage?: number;
  accentPercentage?: number;
}

const LPChart = ({
  primaryPercentage = 49.82,
  accentPercentage = 50.17,
}: LPChartProps) => {
  return (
    <div className="flex-1">
      <div className="relative mx-auto h-48 w-48">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#e0e0e0"
            strokeWidth="12"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#f0f"
            strokeWidth="12"
            strokeDasharray="125.6 125.6"
            strokeDashoffset="0"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#0ff"
            strokeWidth="12"
            strokeDasharray="62.8 188.4"
            strokeDashoffset="-125.6"
          />
        </svg>
      </div>
      <div className="mt-4 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="bg-primary h-3 w-3 rounded-full"></div>
          <span className="text-card-foreground text-sm">
            {primaryPercentage}%
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-accent h-3 w-3 rounded-full"></div>
          <span className="text-card-foreground text-sm">
            {accentPercentage}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default LPChart;
