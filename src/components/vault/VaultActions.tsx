import { Button } from "~/components/ui/button";
import { Share2, Bookmark } from "lucide-react";
import type { Address } from "viem";
import { toast } from "~/components/ui/use-toast";

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
    toast({
      title: isBookmarked ? "Vault removed from saved" : "Vault saved",
      description: isBookmarked
        ? `${vaultName ?? "Vault"} removed from your saved vaults`
        : `${vaultName ?? "Vault"} added to your saved vaults`,
    });
  };

  const handleShare = async () => {
    if (typeof window === "undefined") return;

    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${vaultName ?? "Vault"} | Aqua`,
          text: `Check out this vault on Aqua`,
          url: url,
        });
      } else {
        // Fallback to copying to clipboard
        await navigator.clipboard.writeText(url);
        toast({
          title: "Link copied",
          description: "Vault link copied to clipboard",
        });
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
        className={isBookmarked ? "bg-accent/20 text-accent" : ""}
        disabled={!vaultAddress}
      >
        <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
      </Button>
      <Button variant="outline" size="icon" onClick={handleShare}>
        <Share2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default VaultActions;
