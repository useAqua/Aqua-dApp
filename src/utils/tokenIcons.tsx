import Image from "next/image";
import tokenIcons from "~/assets/tokenIcons";
import type { StaticImageData } from "next/image";
import type { ReactNode } from "react";

export function getTokenIcon(symbol: string): StaticImageData | null {
  const normalizedSymbol = symbol.toLowerCase();

  if (normalizedSymbol.includes("eth")) {
    return tokenIcons.eth;
  } else if (normalizedSymbol === "gte") {
    return tokenIcons.gte;
  } else if (normalizedSymbol === "mega") {
    return tokenIcons.mega;
  } else if (normalizedSymbol.includes("usd")) {
    return tokenIcons.usd;
  }

  return null;
}

interface TokenIconProps {
  symbol: string;
  size?: number;
  className?: string;
}

export function TokenIcon({
  symbol,
  size = 24,
  className = "",
}: TokenIconProps) {
  const icon = getTokenIcon(symbol);

  if (!icon) {
    return (
      <div
        className={`rounded-full bg-gradient-to-br from-blue-400 to-purple-400 ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <Image
      src={icon}
      alt={symbol}
      width={size}
      height={size}
      className={`rounded-full ${className} bg-border/50 backdrop-blur-sm`}
    />
  );
}

export function getTokenIconNode(symbol: string, size = 24): ReactNode {
  return <TokenIcon symbol={symbol} size={size} />;
}
