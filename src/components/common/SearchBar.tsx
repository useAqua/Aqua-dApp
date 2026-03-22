import { Search } from "lucide-react";
import { Input } from "~/components/ui/input";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar = ({
  searchQuery,
  setSearchQuery,
  placeholder = "Search...",
  className = "",
}: SearchBarProps) => {
  return (
    <div className={`relative ${className}`}>
      <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="bg-secondary ring-border pl-9 text-sm shadow-(--shadow-card) ring"
      />
    </div>
  );
};

export default SearchBar;
