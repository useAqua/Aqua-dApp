import { useState, useEffect, useCallback } from "react";
import type { Address } from "viem";

const SAVED_VAULTS_KEY = "aqua_saved_vaults";

export const useSavedVaults = () => {
  const [savedVaults, setSavedVaults] = useState<Address[]>([]);

  // Load saved vaults from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SAVED_VAULTS_KEY);
      if (stored) {
        setSavedVaults(JSON.parse(stored) as Address[]);
      }
    } catch (error) {
      console.error("Error loading saved vaults:", error);
    }
  }, []);

  // Save vaults to localStorage whenever the list changes
  const updateLocalStorage = useCallback((vaults: Address[]) => {
    try {
      localStorage.setItem(SAVED_VAULTS_KEY, JSON.stringify(vaults));
    } catch (error) {
      console.error("Error saving vaults:", error);
    }
  }, []);

  const toggleSaveVault = useCallback(
    (vaultAddress: Address) => {
      setSavedVaults((prev) => {
        const isCurrentlySaved = prev.includes(vaultAddress);
        let newSavedVaults: Address[];

        if (isCurrentlySaved) {
          // Remove from saved
          newSavedVaults = prev.filter((addr) => addr !== vaultAddress);
        } else {
          // Add to saved
          newSavedVaults = [...prev, vaultAddress];
        }

        updateLocalStorage(newSavedVaults);
        return newSavedVaults;
      });
    },
    [updateLocalStorage],
  );

  const isSaved = useCallback(
    (vaultAddress: Address) => {
      return savedVaults.includes(vaultAddress);
    },
    [savedVaults],
  );

  return {
    savedVaults,
    toggleSaveVault,
    isSaved,
  };
};
