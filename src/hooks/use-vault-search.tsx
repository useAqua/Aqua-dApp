import { useState, useMemo } from "react";
import type { VaultTableEntry } from "~/types/vault";

interface UseVaultSearchProps {
  limit?: number;
  vaultData?: VaultTableEntry[];
}

export const useVaultSearch = ({
  limit,
  vaultData,
}: UseVaultSearchProps = {}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVaults = useMemo(() => {
    let filtered = (vaultData ?? []).filter((vault: VaultTableEntry) =>
      vault.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    if (limit) {
      filtered = filtered.slice(0, limit);
    }

    return filtered;
  }, [vaultData, limit, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredVaults,
  };
};
