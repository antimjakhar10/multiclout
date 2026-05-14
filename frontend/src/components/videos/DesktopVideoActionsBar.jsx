import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  LayoutGrid,
  Search,
  UserCircle2,
  LogIn,
} from "lucide-react";

function DesktopVideoActionsBar({
  backTo,
  backLabel = "Back",
  categoriesTo,
  categoriesLabel = "All Categories",
  loggedIn = false,
  searchValue = "",
  setSearchValue,
  searchPlaceholder = "Search videos",
}) {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div className="hidden md:block border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-6 py-4 lg:px-8 xl:px-10">
        <div className="flex items-center gap-3">
          {backTo ? (
            <Link
              to={backTo}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:border-[#167a7a] hover:text-[#167a7a]"
            >
              <ChevronLeft size={18} />
              {backLabel}
            </Link>
          ) : null}

          {categoriesTo ? (
            <Link
              to={categoriesTo}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:border-[#167a7a] hover:text-[#167a7a]"
            >
              <LayoutGrid size={18} />
              {categoriesLabel}
            </Link>
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          {showSearch && setSearchValue ? (
            <div className="relative">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={searchPlaceholder}
                className="h-11 w-[320px] rounded-full border border-gray-300 bg-white pl-11 pr-4 text-sm text-slate-800 outline-none focus:border-[#167a7a]"
                autoFocus
              />
            </div>
          ) : null}

          <button
            type="button"
            onClick={() => setShowSearch((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 transition hover:border-[#167a7a] hover:text-[#167a7a]"
          >
            <Search size={18} />
          </button>

          <Link
            to={loggedIn ? "/account" : "/login"}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:border-[#167a7a] hover:text-[#167a7a]"
          >
            {loggedIn ? <UserCircle2 size={18} /> : <LogIn size={18} />}
            <span>{loggedIn ? "My Account" : "Login"}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DesktopVideoActionsBar;