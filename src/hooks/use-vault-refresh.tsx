import { useRouter } from "next/router";
import { api } from "~/utils/api";

/**
 * Hook to refresh vault data after transactions
 * Invalidates server-side unified cache, client-side TRPC queries, and performs server-side refresh
 */
export function useVaultRefresh() {
  const utils = api.useUtils();
  const router = useRouter();
  const invalidateCacheMutation = api.vaults.invalidateCache.useMutation();

  const refreshVaultData = async () => {
    await invalidateCacheMutation.mutateAsync();
    await utils.invalidate();
    await router.replace(router.asPath);
  };

  return { refreshVaultData };
}
