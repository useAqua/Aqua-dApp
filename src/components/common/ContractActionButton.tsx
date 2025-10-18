import React from "react";
import { Button, type ButtonProps } from "~/components/ui/button";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

const ContractActionButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, onClick, ...props }, ref) => {
    const { openConnectModal } = useConnectModal();
    const { isConnected } = useAccount();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
      setMounted(true);
    }, []);

    if (!mounted || !isConnected) {
      return (
        <Button
          {...props}
          ref={ref}
          onClick={mounted ? (openConnectModal ?? undefined) : undefined}
          disabled={!mounted}
        >
          Connect Wallet
        </Button>
      );
    }

    return (
      <Button {...props} ref={ref} onClick={onClick}>
        {children}
      </Button>
    );
  },
);
ContractActionButton.displayName = "ContractActionButton";

export default ContractActionButton;
