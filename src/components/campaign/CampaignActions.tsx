import { Button } from "~/components/ui/button";
import { Share2, Bookmark } from "lucide-react";
import { cn } from "~/lib/utils";
import { toast } from "~/components/ui/sonner";

interface CampaignActionsProps {
  className?: string;
  campaignId: number;
  campaignName?: string;
  isBookmarked?: boolean;
  onBookmarkToggle?: (campaignId: number) => void;
}

const CampaignActions = ({
  className = "",
  campaignId,
  campaignName,
  isBookmarked = false,
  onBookmarkToggle,
}: CampaignActionsProps) => {
  const handleBookmark = () => {
    if (isNaN(campaignId)) return;
    onBookmarkToggle?.(campaignId);
    toast.success(
      isBookmarked
        ? `${campaignName ?? "Campaign"} removed from your saved campaigns`
        : `${campaignName ?? "Campaign"} added to your saved campaigns`,
    );
  };
  const parts = campaignName?.split("/") ?? ["TokenA", "TokenB"];

  const handleShare = async () => {
    if (typeof window === "undefined") return;

    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${campaignName ?? "Campaign"} | Aqua`,
          text: `${campaignName} LP tokens are deposited into GTE's AMM, earning trading fees, incentives, and points. Earned GTE is converted into equal parts ${parts[0]} and ${parts[1]} to mint more LP tokens. The strategy reinvests these tokens back into the pool, automating the compounding process while socializing gas costs across the campaign.`,
          url: url,
        });
      } else {
        // Fallback to copying to clipboard
        await navigator.clipboard.writeText(url);
        toast.success("Campaign Link copied to clipboard");
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
        disabled={isNaN(campaignId)}
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

export default CampaignActions;
