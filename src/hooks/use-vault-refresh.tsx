import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { useState } from "react";

/**
 * Hook to refresh vault data after transactions
 * Invalidates server-side unified cache, client-side TRPC queries, and performs server-side refresh
 */
export function useVaultRefresh() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const utils = api.useUtils();
  const router = useRouter();
  const invalidateCacheMutation = api.vaults.invalidateCache.useMutation();

  const refreshVaultData = async () => {
    setIsRefreshing(true);
    const { success } = await invalidateCacheMutation.mutateAsync();
    if (success) {
      console.log("Server cache invalidation success");
      await utils.invalidate();
      const isDone = await router.replace(router.asPath);
      if (isDone) {
        setIsRefreshing(false);
      }
    } else {
      console.error("Failed to invalidate server cache");
      setIsRefreshing(false);
    }
  };

  return { refreshVaultData, isRefreshing };
}
