import { Button } from "~/components/ui/button";
import { Share2, Bookmark } from "lucide-react";

interface VaultActionsProps {
  className?: string;
  onBookmark?: () => void;
  onShare?: () => void;
  isBookmarked?: boolean;
}

const VaultActions = ({
  className = "",
  onBookmark,
  onShare,
  isBookmarked = false,
}: VaultActionsProps) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        variant="outline"
        size="icon"
        onClick={onBookmark}
        className={isBookmarked ? "bg-accent/20 text-accent" : ""}
      >
        <Bookmark className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onShare}
      >
        <Share2 className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default VaultActions;
