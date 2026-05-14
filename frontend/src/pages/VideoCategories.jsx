import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Search,
  LayoutGrid,
  Briefcase,
  BookOpen,
  PlayCircle,
  Landmark,
  Camera,
  Lightbulb,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { API } from "../utils/videoHelpers";
import MobileBottomNav from "../components/videos/MobileBottomNav";
import useIsMobileView from "../hooks/useIsMobileView";

const gradients = [
  "from-[#f59e0b] via-[#f97316] to-[#ef4444]",
  "from-[#22c55e] via-[#10b981] to-[#14b8a6]",
  "from-[#ec4899] via-[#d946ef] to-[#8b5cf6]",
  "from-[#fb7185] via-[#f97316] to-[#facc15]",
  "from-[#14b8a6] via-[#22d3ee] to-[#3b82f6]",
  "from-[#a855f7] via-[#8b5cf6] to-[#6366f1]",
  "from-[#84cc16] via-[#22c55e] to-[#14b8a6]",
  "from-[#60a5fa] via-[#3b82f6] to-[#2563eb]",
  "from-[#f43f5e] via-[#ec4899] to-[#8b5cf6]",
];

const DESKTOP_BG =
  "radial-gradient(circle_at_top,rgba(77,154,151,0.12),transparent_28%),linear-gradient(180deg,#05111d_0%,#000000_35%,#000000_100%)";

const getCategoryIcon = (name = "") => {
  const key = name.toLowerCase();

  if (key.includes("business")) return Briefcase;
  if (key.includes("knowledge")) return BookOpen;
  if (key.includes("youtube")) return PlayCircle;
  if (key.includes("finance")) return Landmark;
  if (key.includes("instagram")) return Camera;
  return Lightbulb;
};

function VideoCategories() {
  const navigate = useNavigate();
  const isMobile = useIsMobileView();
  const [categories, setCategories] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [desktopSearchOpen, setDesktopSearchOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token =
        localStorage.getItem("userToken") || localStorage.getItem("token");

      const res = await fetch(`${API}/videos/watch-page`, {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
      });

      const result = await res.json();

      if (result.success) {
        setCategories(result.categories || []);
      }
    } catch (error) {
      console.error("categories fetch error:", error);
    }
  };

  const filteredCategories = useMemo(() => {
    if (!searchValue.trim()) return categories;

    const query = searchValue.toLowerCase();
    return categories.filter((cat) =>
      cat?.name?.toLowerCase?.().includes(query)
    );
  }, [categories, searchValue]);

  return (
    <div
      className="min-h-screen pb-24 md:pb-0"
      style={{
        background: isMobile ? "var(--mc-bg-main)" : "#000000",
        color: isMobile ? "var(--mc-text-main)" : "#ffffff",
      }}
    >
      <div className="hidden md:block">
  <Navbar />
</div>

<div className="md:hidden">
  <Navbar />
</div>

      <div className="hidden md:block border-b border-white/10 bg-black/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-4 md:px-8">
          <Link
            to="/watch-videos"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-4 text-sm font-semibold text-white transition hover:border-[#8fd4cf]/40 hover:text-[#8fd4cf]"
          >
            <ChevronLeft size={18} />
            Back
          </Link>

          <div className="flex items-center gap-3">
            {desktopSearchOpen && (
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/45"
                />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search category"
                  className="h-11 w-[280px] rounded-full border border-white/10 bg-white/[0.05] pl-11 pr-4 text-sm text-white placeholder:text-white/40 outline-none focus:border-[#4d9a97]/40"
                />
              </div>
            )}

            <button
              type="button"
              onClick={() => setDesktopSearchOpen((prev) => !prev)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] text-white transition hover:border-[#4d9a97]/40"
            >
              <Search size={18} />
            </button>

            <button
              type="button"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-5 text-sm font-semibold text-white"
            >
              <LayoutGrid size={18} />
              All Categories
            </button>
          </div>
        </div>
      </div>

      <div
        style={{
          background: isMobile ? "var(--mc-surface-gradient)" : DESKTOP_BG,
        }}
      >
        <div className="mx-auto max-w-[1600px] px-4 py-5 md:px-8 md:py-10">
          <div className="mb-5 md:mb-7">
            <h1
              className="text-[26px] font-bold md:text-5xl"
              style={{ color: isMobile ? "var(--mc-text-main)" : "#ffffff" }}
            >
              All Categories
            </h1>
            <p
              className="mt-2 text-sm md:text-lg"
              style={{ color: isMobile ? "var(--mc-text-soft)" : "#ffffffb3" }}
            >
              Explore videos by category
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {filteredCategories.map((cat, index) => {
              const Icon = getCategoryIcon(cat.name);

              return (
                <Link
                  key={cat.slug}
                  to={`/watch-videos/category/${cat.slug}`}
                  className={`group relative overflow-hidden rounded-[20px] bg-gradient-to-br ${
                    gradients[index % gradients.length]
                  } p-[1px] shadow-[0_10px_24px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-1 md:rounded-[24px]`}
                >
                  <div className="relative flex h-[138px] flex-col justify-between overflow-hidden rounded-[19px] bg-black/20 p-3 md:h-[170px] md:rounded-[23px] md:p-5">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_35%)] opacity-70" />
                    <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/10 blur-2xl transition duration-300 group-hover:scale-110" />
                    <div className="absolute -left-8 bottom-0 h-16 w-16 rounded-full bg-black/15 blur-2xl" />

                    <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur">
                      <Icon size={20} />
                    </div>

                    <div className="relative z-10">
                      <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.18em] text-white/75 md:text-xs">
                        {cat.count || 0} Videos
                      </p>
                      <h3 className="text-[15px] font-bold leading-tight text-white sm:text-[18px] md:text-[24px]">
                        {cat.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {!filteredCategories.length && (
            <div className="mt-8 flex min-h-[220px] items-center justify-center rounded-[24px] border border-white/10 bg-white/[0.03] px-4 text-center text-white/70">
              No matching categories found.
            </div>
          )}
        </div>
      </div>

      <div className="hidden md:block">
        <Footer />
      </div>

      <MobileBottomNav />
    </div>
  );
}

export default VideoCategories;