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
  chain = "BASE",
  platform,
  actions,
  className = "",
}: VaultHeaderProps) => {
  return (
    <div className={`mb-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-3xl">
            {icon}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-muted-foreground">
                CHAIN: <span className="text-foreground">{chain}</span>
              </span>
              <span className="text-sm text-muted-foreground">
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
