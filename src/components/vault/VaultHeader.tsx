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
    <div className={`mb-6 ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-secondary flex h-16 w-16 items-center justify-center rounded-full text-3xl">
            {icon}
          </div>
          <div>
            <h1 className="text-lg font-bold md:text-3xl">{name}</h1>
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
        {actions && <div>{actions}</div>}
      </div>
    </div>
  );
};

export default VaultHeader;
