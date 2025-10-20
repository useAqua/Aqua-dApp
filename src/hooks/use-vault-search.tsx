import { useState, useMemo } from "react";
import type { VaultTableEntry } from "~/types/vault";

interface UseVaultSearchProps {
  limit?: number;
  vaultData?: VaultTableEntry[];
  filterFn?: (vault: VaultTableEntry) => boolean;
}

export const useVaultSearch = ({
  limit,
  vaultData,
  filterFn,
}: UseVaultSearchProps = {}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVaults = useMemo(() => {
    let filtered = (vaultData ?? []).filter((vault: VaultTableEntry) =>
      vault.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    // Apply custom filter function if provided
    if (filterFn) {
      filtered = filtered.filter(filterFn);
    }

    if (limit) {
      filtered = filtered.slice(0, limit);
    }

    return filtered;
  }, [vaultData, limit, searchQuery, filterFn]);

  return {
    searchQuery,
    setSearchQuery,
    filteredVaults,
  };
};
