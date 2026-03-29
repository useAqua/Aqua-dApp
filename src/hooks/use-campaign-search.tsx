import { useState, useMemo } from "react";
import type { CampaignInfo } from "~/types/contracts";

interface UseCampaignSearchProps {
  limit?: number;
  campaignData?: CampaignInfo[];
  filterFn?: (campaign: CampaignInfo) => boolean;
}

export const useCampaignSearch = ({
  limit,
  campaignData,
  filterFn,
}: UseCampaignSearchProps = {}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCampaigns = useMemo(() => {
    const searchLower = searchQuery.toLowerCase();
    let filtered = (campaignData ?? []).filter(
      (campaign: CampaignInfo) =>
        campaign.id.toString().includes(searchLower) ||
        campaign.creator.toLowerCase().includes(searchLower),
    );

    // Apply custom filter function if provided
    if (filterFn) {
      filtered = filtered.filter(filterFn);
    }

    if (limit) {
      filtered = filtered.slice(0, limit);
    }

    return filtered;
  }, [campaignData, limit, searchQuery, filterFn]);

  return {
    searchQuery,
    setSearchQuery,
    filteredCampaigns,
  };
};
