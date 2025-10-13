import { type AppType } from "next/app";
import { Geist } from "next/font/google";
import "@rainbow-me/rainbowkit/styles.css";
import { api } from "~/utils/api";

import "~/styles/globals.css";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "~/lib/wagmiConfig";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";

const geist = Geist({
  subsets: ["latin"],
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className={geist.className}>
      <WagmiProvider config={wagmiConfig}>
        <RainbowKitProvider>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </WagmiProvider>
    </div>
  );
};

export default api.withTRPC(MyApp);
