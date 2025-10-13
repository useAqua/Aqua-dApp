import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { megaethTestnet } from "wagmi/chains";
import { env } from "~/env";

export const wagmiConfig = getDefaultConfig({
  appName: "use-aqua-dapp",
  projectId: env.NEXT_PUBLIC_PROJECT_ID ?? "default-project-id",
  chains: [megaethTestnet],
});
