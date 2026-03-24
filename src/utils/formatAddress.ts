/**
 * Truncates an Ethereum address for display purposes.
 * e.g. "0x1234...abcd"
 */
export const formatAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

