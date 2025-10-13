import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { arbitrum } from "wagmi/chains";
import { env } from "~/env";

export const wagmiConfig = getDefaultConfig({
  appName: "tRPC-NextJs-Wagmi",
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  projectId: env.NEXT_PUBLIC_PROJECT_ID ?? "default-project-id",
  chains: [arbitrum],
});
