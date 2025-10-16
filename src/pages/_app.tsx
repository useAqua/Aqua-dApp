import { type AppType } from "next/app";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import localFont from "next/font/local";
import "@rainbow-me/rainbowkit/styles.css";
import { api } from "~/utils/api";
import { Toaster } from "~/components/ui/toaster";
import { Toaster as Sonner } from "~/components/ui/sonner";
import { TooltipProvider } from "~/components/ui/tooltip";
import merge from "lodash.merge";

import "~/styles/globals.css";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "~/lib/wagmiConfig";
import {
  lightTheme,
  RainbowKitProvider,
  type Theme,
} from "@rainbow-me/rainbowkit";
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

const rainbowTheme = merge(lightTheme(), {
  colors: {
    accentColor: "#01387C", // Dark Cerulean - primary brand color
    accentColorForeground: "#F1C67C", // Old Lace - text on accent
    actionButtonBorder: "transparent",
    actionButtonBorderMobile: "transparent",
    actionButtonSecondaryBackground: "#ecf2f9",
    closeButton: "#01387C",
    closeButtonBackground: "#ecf2f9",
    connectButtonBackground: "#FFFFFF",
    connectButtonBackgroundError: "#FF0000",
    connectButtonInnerBackground: "#ecf2f9",
    connectButtonText: "#01387C",
    connectButtonTextError: "#FF0000",
    connectionIndicator: "#30E000",
    downloadBottomCardBackground:
      "linear-gradient(126deg, rgba(255, 255, 255, 0) 9.49%, rgba(171, 171, 171, 0.04) 71.04%), #FFFFFF",
    downloadTopCardBackground:
      "linear-gradient(126deg, rgba(171, 171, 171, 0.2) 9.49%, rgba(255, 255, 255, 0) 71.04%), #FFFFFF",
    error: "#FF494A",
    generalBorder: "transparent",
    generalBorderDim: "transparent",
    menuItemBackground: "#F1C67C",
    modalBackdrop: "rgba(1, 56, 124, 0.3)",
    modalBackground: "#fefefc",
    modalBorder: "transparent",
    modalText: "#01387C",
    modalTextDim: "rgba(1, 56, 124, 0.6)",
    modalTextSecondary: "rgba(1, 56, 124, 0.7)",
    profileAction: "#ecf2f9",
    profileActionHover: "#F1C67C",
    profileForeground: "#FFFFFF",
    selectedOptionBorder: "transparent",
    standby: "#F1C67C", // Topaz
  },
  fonts: {
    body: "var(--font-inter)",
  },
  radii: {
    actionButton: "12px",
    connectButton: "12px",
    menuButton: "12px",
    modal: "12px",
    modalMobile: "12px",
  },
  shadows: {
    connectButton:
      "0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)",
    dialog: "0 10px 25px rgba(1, 56, 124, 0.1)",
    profileDetailsAction: "0 2px 4px rgba(1, 56, 124, 0.05)",
    selectedOption: "0 2px 6px rgba(241, 198, 124, 0.2)",
    selectedWallet: "0 2px 6px rgba(1, 56, 124, 0.1)",
    walletLogo: "0 2px 4px rgba(1, 56, 124, 0.05)",
  },
} as Theme);

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div
      className={cn(
        bricolageFont.variable,
        interFont.variable,
        redactionFont.variable,
      )}
    >
      <WagmiProvider config={wagmiConfig}>
        <RainbowKitProvider
          theme={rainbowTheme}
          modalSize="compact"
          showRecentTransactions={true}
        >
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
