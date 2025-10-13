import { useState, useMemo } from "react";
import { mockVaults } from "~/lib/mockData";
import type { Vault } from "~/types/vault";

interface UseVaultSearchProps {
  limit?: number;
}

export const useVaultSearch = ({ limit }: UseVaultSearchProps = {}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVaults = useMemo(() => {
    let filtered = mockVaults.filter((vault: Vault) =>
      vault.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (limit) {
      filtered = filtered.slice(0, limit);
    }

    return filtered;
  }, [searchQuery, limit]);

  return {
    searchQuery,
    setSearchQuery,
    filteredVaults,
  };
};
