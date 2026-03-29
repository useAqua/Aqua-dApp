import { api } from "~/utils/api";
import { useState } from "react";

/**
 * Hook to refresh campaign data after transactions.
 * Invalidates the server-side unified cache then all client-side React Query caches.
 */
export function useVaultRefresh() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const utils = api.useUtils();
  const invalidateCacheMutation = api.campaign.invalidateCache.useMutation();

  const refreshVaultData = async () => {
    setIsRefreshing(true);
    const { success } = await invalidateCacheMutation.mutateAsync();
    if (success) {
      console.log("Server cache invalidation success");
      await utils.invalidate();
    } else {
      console.error("Failed to invalidate server cache");
    }
    setIsRefreshing(false);
  };

  return { refreshVaultData, isRefreshing };
}
