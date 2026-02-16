"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { LoaderCircleIcon, Wallet } from "lucide-react";
import { cn } from "~/lib/utils";
export const CustomConnectButton = ({
  hideDisplayOnMobile = false,
  fullWidth = false,
}: {
  hideDisplayOnMobile?: boolean;
  fullWidth?: boolean;
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
                    className={cn(
                      "rounded-md max-sm:text-xs",
                      fullWidth ? "w-full" : "sm:w-[150px]",
                    )}
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
                    className={cn(
                      "rounded-md font-bold text-red-500 outline-2 outline-red-500 hover:font-normal max-sm:text-xs",
                      fullWidth ? "w-full" : "sm:w-[150px]",
                    )}
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
                  className={cn(
                    "flex items-center gap-2 rounded-full max-sm:text-xs",
                    fullWidth ? "w-full" : "sm:w-auto",
                  )}
                >
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

                  <div className="bg-border h-4 w-0.5" />

                  <div className="flex items-center gap-2 sm:px-1">
                    {account.displayBalance && (
                      <span>{account.displayBalance}</span>
                    )}
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
