import { useAccount } from "wagmi";

import { api } from "~/utils/api";
import PageLayout from "~/components/PageLayout";

export default function Home() {
  const { address } = useAccount();

  const balance = api.w3test.balance.useQuery(address ?? "", {
    enabled: !!address, // Only run the query if address is available
  });

  return (
    <PageLayout title="AQUA DeFi - Portfolio" description="Manage your DeFi portfolio">
      Home
    </PageLayout>
  );
}
