"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { LoaderCircleIcon, Wallet } from "lucide-react";
export const CustomConnectButton = () => {
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
                    className="max-sm:text-xs sm:w-[150px]"
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
                      "font-bold text-red-500 outline-2 outline-red-500 hover:font-normal max-sm:text-xs sm:w-[150px]"
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
                  className="max-sm:text-xs"
                >
                  {account.hasPendingTransactions ? (
                    <LoaderCircleIcon className="h-6 w-6 animate-spin" />
                  ) : (
                    chain.iconUrl && (
                      <Image
                        src={chain.iconUrl ?? ""}
                        width={24}
                        height={24}
                        alt={chain.name ?? "Chain Image"}
                        className="rounded-full"
                      />
                    )
                  )}
                  {account.ensName ?? account.displayName}

                  {account.displayBalance ? (
                    <>
                      <Wallet className="h-4 w-4 sm:ml-4" />
                      <span>{account.displayBalance}</span>
                    </>
                  ) : (
                    ""
                  )}
                </Button>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
