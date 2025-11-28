import React from "react";
import { Search, SlidersHorizontal } from "lucide-react";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  onFilterClick?: () => void;
}

export default function SearchBar({ onSearch, onFilterClick }: SearchBarProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 relative">
        <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
        <input 
          className="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-card placeholder:text-muted-foreground/70 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" 
          placeholder="Search documents..."
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </div>
      <button 
        onClick={onFilterClick}
        className="inline-flex items-center gap-2 px-3 h-11 rounded-xl border border-input bg-card text-foreground/80 text-sm hover:bg-muted/40"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filters
      </button>
    </div>
  );
}
