import { TokenIcon } from "~/utils/tokenIcons";

interface VaultIconProps {
  vaultName?: string;
  size?: "sm" | "md" | "lg";
}

const VaultIcon = ({ vaultName, size = "md" }: VaultIconProps) => {
  const sizeClasses = {
    sm: `text-sm `,
    md: `text-lg `,
    lg: `text-xl `,
  };

  const sizeStyles = {
    sm: { width: 36, height: 24 },
    md: { width: 60, height: 40 },
    lg: { width: 72, height: 48 },
  };

  const iconSizes = {
    sm: 24,
    md: 40,
    lg: 48,
  };

  const tokens = vaultName?.split("/").map((t) => t.trim()) ?? [];

  if (tokens.length === 2) {
    return (
      <div
        className={`relative flex shrink-0 items-center ${sizeClasses[size]}`}
        style={sizeStyles[size]}
      >
        <TokenIcon
          symbol={tokens[0]!}
          size={iconSizes[size]}
          className="relative z-10"
        />
        <TokenIcon
          symbol={tokens[1]!}
          size={iconSizes[size]}
          className="absolute right-0 z-0"
        />
      </div>
    );
  }

  // Fallback to blank icon
  return (
    <div
      className={`bg-primary/10 flex shrink-0 items-center justify-center rounded-full font-semibold backdrop-blur-md ${sizeClasses[size]}`}
    ></div>
  );
};

export default VaultIcon;
