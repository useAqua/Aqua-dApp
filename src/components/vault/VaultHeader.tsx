import { type ReactNode } from "react";

interface VaultHeaderProps {
  icon: ReactNode;
  name: string;
  chain?: string;
  platform: string;
  actions?: ReactNode;
  className?: string;
}

const VaultHeader = ({
  icon,
  name,
  chain = "MEGAETH",
  platform,
  actions,
  className = "",
}: VaultHeaderProps) => {
  return (
    <div className={`mb-6 ${className} relative`}>
      <div className="mb-4 flex justify-between gap-y-8">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center justify-center text-3xl">
            {icon}
          </div>
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">{name}</h1>
            <div className="mt-2 flex items-center gap-8">
              <span className="text-muted-foreground text-sm">
                CHAIN: <span className="text-foreground">{chain}</span>
              </span>
              <span className="text-muted-foreground text-sm">
                PLATFORM: <span className="text-foreground">{platform}</span>
              </span>
            </div>
          </div>
        </div>
        {actions && <div className={""}>{actions}</div>}
      </div>
    </div>
  );
};

export default VaultHeader;
