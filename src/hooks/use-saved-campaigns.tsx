import { useState, useEffect, useCallback } from "react";

const SAVED_CAMPAIGNS_KEY = "aqua_saved_campaigns";

export const useSavedCampaigns = () => {
  const [savedCampaigns, setSavedCampaigns] = useState<number[]>([]);

  // Load saved campaigns from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SAVED_CAMPAIGNS_KEY);
      if (stored) {
        setSavedCampaigns(JSON.parse(stored) as number[]);
      }
    } catch (error) {
      console.error("Error loading saved campaigns:", error);
    }
  }, []);

  // Save campaigns to localStorage whenever the list changes
  const updateLocalStorage = useCallback((campaigns: number[]) => {
    try {
      localStorage.setItem(SAVED_CAMPAIGNS_KEY, JSON.stringify(campaigns));
    } catch (error) {
      console.error("Error saving campaigns:", error);
    }
  }, []);

  const toggleSaveCampaign = useCallback(
    (campaignId: number) => {
      setSavedCampaigns((prev) => {
        const isCurrentlySaved = prev.includes(campaignId);
        let newSavedCampaigns: number[];

        if (isCurrentlySaved) {
          // Remove from saved
          newSavedCampaigns = prev.filter((addr) => addr !== campaignId);
        } else {
          // Add to saved
          newSavedCampaigns = [...prev, campaignId];
        }

        updateLocalStorage(newSavedCampaigns);
        return newSavedCampaigns;
      });
    },
    [updateLocalStorage],
  );

  const isSaved = useCallback(
    (campaignId: number) => {
      return savedCampaigns.includes(campaignId);
    },
    [savedCampaigns],
  );

  return {
    savedCampaigns,
    toggleSaveCampaign,
    isSaved,
  };
};
