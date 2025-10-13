import { type AppType } from "next/app";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import localFont from "next/font/local";
import "@rainbow-me/rainbowkit/styles.css";
import { api } from "~/utils/api";
import { Toaster } from "~/components/ui/toaster";
import { Toaster as Sonner } from "~/components/ui/sonner";
import { TooltipProvider } from "~/components/ui/tooltip";

import "~/styles/globals.css";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "~/lib/wagmiConfig";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { cn } from "~/lib/utils";

const bricolageFont = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-bricolage",
});
const interFont = Inter({ subsets: ["latin"], variable: "--font-inter" });

const redactionFont = localFont({
  src: [
    {
      path: "../assets/fonts/redaction/Redaction-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/redaction/Redaction-Italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../assets/fonts/redaction/Redaction-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-redaction",
});


const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className={cn(bricolageFont.variable, interFont.variable, redactionFont.variable)}>
      <WagmiProvider config={wagmiConfig}>
        <RainbowKitProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Component {...pageProps} />
          </TooltipProvider>
        </RainbowKitProvider>
      </WagmiProvider>
    </div>
  );
};

export default api.withTRPC(MyApp);
