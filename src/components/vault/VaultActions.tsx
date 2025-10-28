import { Button } from "~/components/ui/button";
import { Share2, Bookmark } from "lucide-react";
import type { Address } from "viem";
import { cn } from "~/lib/utils";
import { toast } from "~/components/ui/sonner";

interface VaultActionsProps {
  className?: string;
  vaultAddress?: Address;
  vaultName?: string;
  isBookmarked?: boolean;
  onBookmarkToggle?: (address: Address) => void;
}

const VaultActions = ({
  className = "",
  vaultAddress,
  vaultName,
  isBookmarked = false,
  onBookmarkToggle,
}: VaultActionsProps) => {
  const handleBookmark = () => {
    if (!vaultAddress) return;
    onBookmarkToggle?.(vaultAddress);
    toast.success(
      isBookmarked
        ? `${vaultName ?? "Vault"} removed from your saved vaults`
        : `${vaultName ?? "Vault"} added to your saved vaults`,
    );
  };
  const parts = vaultName?.split("/") ?? ["TokenA", "TokenB"];

  const handleShare = async () => {
    if (typeof window === "undefined") return;

    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${vaultName ?? "Vault"} | Aqua`,
          text: `${vaultName} LP tokens are deposited into GTE's AMM, earning trading fees, incentives, and points. Earned GTE is converted into equal parts ${parts[0]} and ${parts[1]} to mint more LP tokens. The strategy reinvests these tokens back into the pool, automating the compounding process while socializing gas costs across the vault.`,
          url: url,
        });
      } else {
        // Fallback to copying to clipboard
        await navigator.clipboard.writeText(url);
        toast.success("Vault Link copied to clipboard");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        variant="outline"
        size="icon"
        onClick={handleBookmark}
        className={cn(
          isBookmarked ? "bg-primary/20 text-primary" : "",
          "max-sm:h-8 max-sm:w-8",
        )}
        disabled={!vaultAddress}
      >
        <Bookmark
          className={`h-2 w-2 sm:h-4 sm:w-4 ${isBookmarked ? "fill-current" : ""}`}
        />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={handleShare}
        className="max-sm:h-8 max-sm:w-8"
      >
        <Share2 className="h-2 w-2 sm:h-4 sm:w-4" />
      </Button>
    </div>
  );
};

export default VaultActions;
