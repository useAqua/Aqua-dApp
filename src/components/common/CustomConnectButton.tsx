"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { LoaderCircleIcon, Wallet } from "lucide-react";
import { cn } from "~/lib/utils";
export const CustomConnectButton = ({
  hideDisplayOnMobile = false,
}: {
  hideDisplayOnMobile?: boolean;
}) => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");
        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    onClick={openConnectModal}
                    type="button"
                    className="rounded-md max-sm:text-xs sm:w-[150px]"
                  >
                    <Wallet className="h-4 w-4 sm:mr-2" />
                    Connect
                  </Button>
                );
              }
              if (chain.unsupported) {
                return (
                  <Button
                    onClick={openChainModal}
                    type="button"
                    variant="outline"
                    className={
                      "rounded-md font-bold text-red-500 outline-2 outline-red-500 hover:font-normal max-sm:text-xs sm:w-[150px]"
                    }
                  >
                    Wrong network
                  </Button>
                );
              }
              return (
                <Button
                  onClick={openAccountModal}
                  type="button"
                  // variant="outline"
                  className="flex items-center gap-3 rounded-md max-sm:text-xs"
                >
                  <div className="flex items-center gap-2 px-2">
                    {account.hasPendingTransactions ? (
                      <LoaderCircleIcon className="h-4 w-4 animate-spin" />
                    ) : (
                      chain.iconUrl && (
                        <Image
                          src={chain.iconUrl ?? ""}
                          width={20}
                          height={20}
                          alt={chain.name ?? "Chain Image"}
                          className="rounded-full"
                        />
                      )
                    )}
                    {account.displayBalance && (
                      <span>{account.displayBalance}</span>
                    )}
                  </div>

                  <div className="bg-border h-6 w-0.5" />

                  <div className="flex items-center gap-2">
                    {account.ensAvatar ? (
                      <Image
                        src={account.ensAvatar}
                        width={24}
                        height={24}
                        alt="Account avatar"
                        className="rounded-full"
                      />
                    ) : (
                      <div className="h-6 w-6 rounded-full bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400" />
                    )}
                    <span
                      className={cn(
                        hideDisplayOnMobile ? "hidden sm:inline" : "",
                      )}
                    >
                      {" "}
                      {account.ensName ?? account.displayName}
                    </span>
                  </div>
                </Button>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
