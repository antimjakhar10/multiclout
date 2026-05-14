import { Search } from "lucide-react";

function LearnSearchBar({ search, setSearch }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-lg shadow-black/20">
        <Search size={18} className="text-white/60" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search videos, reels, categories..."
          className="w-full bg-transparent text-sm text-white placeholder:text-white/45 focus:outline-none"
        />
      </div>
    </div>
  );
}

export default LearnSearchBar;