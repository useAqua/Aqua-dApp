import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { env } from "~/env";
import chainToUse from "~/lib/chainToUse";
import {
  metaMaskWallet,
  rabbyWallet,
  rainbowWallet,
} from "@rainbow-me/rainbowkit/wallets";

export const wagmiConfig = getDefaultConfig({
  appName: "use-aqua-dapp",
  projectId: env.NEXT_PUBLIC_PROJECT_ID ?? "default-project-id",
  chains: [chainToUse],
  wallets: [
    {
      groupName: "Suggested",
      wallets: [metaMaskWallet, rabbyWallet, rainbowWallet],
    },
  ],
});
