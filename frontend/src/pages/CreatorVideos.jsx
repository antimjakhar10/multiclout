import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  LayoutGrid,
  Search,
  Briefcase,
  BookOpen,
  PlayCircle,
  Landmark,
  Camera,
  Lightbulb,
  Download,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import VideoRowSection from "../components/videos/VideoRowSection";
import MobileBottomNav from "../components/videos/MobileBottomNav";
import { API } from "../utils/videoHelpers";
import useIsMobileView from "../hooks/useIsMobileView";
import HeroSection from "../components/HeroSection";

const HISTORY_KEY = "multiclout_watch_history";
const DESKTOP_BG =
  "radial-gradient(circle_at_top,rgba(34,211,238,0.10),transparent_26%),linear-gradient(180deg,#07111f_0%,#020617_40%,#000000_100%)";

const getCategoryIcon = (name = "") => {
  const key = name.toLowerCase();

  if (key.includes("business")) return Briefcase;
  if (key.includes("knowledge")) return BookOpen;
  if (key.includes("youtube")) return PlayCircle;
  if (key.includes("finance")) return Landmark;
  if (key.includes("instagram")) return Camera;
  return Lightbulb;
};

function CreatorVideos() {
  const navigate = useNavigate();
  const isMobile = useIsMobileView();

  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [desktopSearchOpen, setDesktopSearchOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [data, setData] = useState({
    topPicks: [],
    categories: [],
    sections: [],
  });

  useEffect(() => {
    fetchWatchPage();
  }, []);

  const fetchWatchPage = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("userToken") || localStorage.getItem("token");

      const res = await fetch(`${API}/videos/creator-videos`, {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
      });

      const result = await res.json();

      if (result.success) {
        setData({
          topPicks: result.topPicks || [],
          categories: result.categories || [],
          sections: result.sections || [],
        });
      } else {
        setData({
          topPicks: [],
          categories: [],
          sections: [],
        });
      }
    } catch (error) {
      console.error("watch page fetch error:", error);
      setData({
        topPicks: [],
        categories: [],
        sections: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const normalizedCategories = useMemo(() => {
    const rawCategories = Array.isArray(data.categories) ? data.categories : [];

    const mapped = rawCategories
      .map((item, index) => {
        if (typeof item === "string") {
          return {
            key: `${item}-${index}`,
            label: item,
            value: item,
            slug: item.toLowerCase().replace(/\s+/g, "-"),
          };
        }

        if (item && typeof item === "object") {
          const label =
            item.name || item.title || item.slug || `Category ${index + 1}`;
          const value = item.name || item.title || item.slug || label;

          return {
            key: `${item.slug || item.name || item.title || "category"}-${index}`,
            label,
            value,
            slug: item.slug || label.toLowerCase().replace(/\s+/g, "-"),
          };
        }

        return null;
      })
      .filter(Boolean);

    return mapped.slice(0, 6);
  }, [data.categories]);

  const filteredSections = useMemo(() => {
    let sections = Array.isArray(data.sections) ? [...data.sections] : [];

    if (activeCategory !== "All") {
      sections = sections.filter((section) => {
        const active = activeCategory.toLowerCase();
        const title = section?.title?.toLowerCase?.() || "";
        const slug = section?.slug?.toLowerCase?.() || "";

        const sectionMatch = title === active || slug === active;

        const videoMatch = (section?.videos || []).some((video) => {
          const category = video?.category?.toLowerCase?.() || "";
          return category === active;
        });

        return sectionMatch || videoMatch;
      });
    }

    if (!searchValue.trim()) return sections;

    const query = searchValue.toLowerCase();

    return sections
      .map((section) => ({
        ...section,
        videos: (section.videos || []).filter((video) => {
          return (
            video.title?.toLowerCase().includes(query) ||
            video.description?.toLowerCase().includes(query) ||
            video.category?.toLowerCase().includes(query)
          );
        }),
      }))
      .filter((section) => section.videos.length > 0);
  }, [data.sections, searchValue, activeCategory]);

  const topPicks = useMemo(() => {
    if (activeCategory === "All") return data.topPicks || [];

    return (data.topPicks || []).filter((video) => {
      return video?.category?.toLowerCase() === activeCategory.toLowerCase();
    });
  }, [data.topPicks, activeCategory]);

  const trendingVideos = useMemo(() => {
    return topPicks.slice(0, 10);
  }, [topPicks]);

  const saveToHistory = (video) => {
    try {
      const parsed = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
      const existing = Array.isArray(parsed) ? parsed : [];

      const filtered = existing.filter(
        (entry) => (entry?._id || entry?.slug) !== (video?._id || video?.slug),
      );

      const updated = [video, ...filtered].slice(0, 20);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error("history save error:", error);
    }
  };

  const handleVideoOpen = (video) => {
    saveToHistory(video);
  };

  return (
    <div
      className="min-h-screen pb-24 md:pb-0"
      style={{
        background: isMobile ? "var(--mc-bg-main)" : "#000000",
        color: isMobile ? "var(--mc-text-main)" : "#ffffff",
      }}
    >
      <div className="sticky top-0 z-[100] hidden md:block bg-white shadow-sm">
        <Navbar />
      </div>

      <div className="md:hidden">
        <Navbar />
      </div>

      <div className="md:hidden">
        <HeroSection
          mobileWatchScrollTarget="mobile-videos-start"
          title="Creator Videos"
          subtitle="Watch videos uploaded by Multiclout creators and community members."
        />
      </div>

      <div className="grid grid-cols-2 gap-2 px-4 mt-2 mb-5 md:hidden">
        <a
          href="https://multiclout.com/portal/user/resource_login.html"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl bg-gradient-to-r from-[#0f8c92] via-[#13b8c6] to-[#10c990] px-3 py-3 text-center text-[12px] font-bold leading-none text-white !text-white shadow-[0_10px_24px_rgba(19,184,198,0.22)]"
        >
          Member Login
        </a>

        <a
          href="https://multiclout.com/portal/welcome/registration.html"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl bg-gradient-to-r from-[#0f8c92] via-[#13b8c6] to-[#10c990] px-3 py-3 text-center text-[12px] font-bold leading-none text-white !text-white shadow-[0_10px_24px_rgba(19,184,198,0.22)]"
        >
          Member Register
        </a>

        <a
          href="/login"
          className="col-span-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-3 py-3 text-center text-[12px] font-bold leading-none text-cyan-200 shadow-[0_10px_24px_rgba(19,184,198,0.12)]"
        >
          Login
        </a>
        <a
          href="#download-app"
          className="col-span-2 rounded-xl border border-cyan-400/40 bg-gradient-to-r from-[#07111f] via-[#0a2a2f] to-[#07111f] px-3 py-3.5 text-center shadow-[0_10px_30px_rgba(34,211,238,0.12)] flex items-center justify-center gap-2"
        >
          <Download size={18} className="text-cyan-300" />

          <span className="text-[16px] font-extrabold tracking-wide text-transparent bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]">
            Download App
          </span>
        </a>
      </div>
      <div className="relative mx-4 mt-3 mb-4 md:hidden">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2"
          style={{ color: "var(--mc-text-faint)" }}
        />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search creator videos"
          className="h-11 w-full rounded-[18px] border pl-11 pr-4 text-[14px] outline-none"
          style={{
            background: "var(--mc-input-bg)",
            borderColor: "var(--mc-border)",
            color: "var(--mc-text-main)",
          }}
        />
      </div>

      <div className="hidden md:block border-b border-white/10 bg-black/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-4 md:px-8">
          <div />

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
                  placeholder="Search creator videos"
                  className="h-11 w-[300px] rounded-full border border-white/10 bg-white/[0.05] pl-11 pr-4 text-sm text-white placeholder:text-white/40 outline-none focus:border-[#4d9a97]/40"
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
              onClick={() => navigate("/creator-videos/categories")}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-5 text-sm font-semibold text-white transition hover:border-[#4d9a97]/40"
            >
              <LayoutGrid size={18} />
              All Categories
            </button>
          </div>
        </div>
      </div>

      <div className="md:hidden px-4 pb-4 pt-2">
        <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setActiveCategory("All")}
            className="min-w-[92px] flex-shrink-0 rounded-[18px] border px-2 py-3 text-center transition"
            style={{
              borderColor:
                activeCategory === "All" ? "#22d3ee" : "var(--mc-chip-border)",
              background:
                activeCategory === "All"
                  ? "rgba(34,211,238,0.12)"
                  : "var(--mc-chip-bg)",
              color: "var(--mc-text-main)",
            }}
          >
            <div
              className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-2xl"
              style={{
                background:
                  activeCategory === "All" ? "#22d3ee" : "var(--mc-bg-card)",
                color:
                  activeCategory === "All" ? "#06101d" : "var(--mc-text-main)",
              }}
            >
              <LayoutGrid size={18} />
            </div>
            <span className="block text-[11px] font-semibold">All</span>
          </button>

          {normalizedCategories.slice(0, 5).map((category) => {
            const Icon = getCategoryIcon(category.label);
            const active = activeCategory === category.value;

            return (
              <button
                key={category.key}
                onClick={() => setActiveCategory(category.value)}
                className="min-w-[92px] flex-shrink-0 rounded-[18px] border px-2 py-3 text-center transition"
                style={{
                  borderColor: active ? "#22d3ee" : "var(--mc-chip-border)",
                  background: active
                    ? "rgba(34,211,238,0.12)"
                    : "var(--mc-chip-bg)",
                  color: "var(--mc-text-main)",
                }}
              >
                <div
                  className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-2xl"
                  style={{
                    background: active ? "#22d3ee" : "var(--mc-bg-card)",
                    color: active ? "#06101d" : "var(--mc-text-main)",
                  }}
                >
                  <Icon size={18} />
                </div>
                <span className="block line-clamp-1 text-[11px] font-semibold">
                  {category.label}
                </span>
              </button>
            );
          })}

          <button
            onClick={() => navigate("/creator-videos/categories")}
            className="min-w-[110px] flex-shrink-0 rounded-[18px] border px-4 py-3 text-center transition"
            style={{
              borderColor: "var(--mc-chip-border)",
              background: "var(--mc-chip-bg)",
              color: "#22d3ee",
            }}
          >
            <div
              className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-2xl"
              style={{
                background: "var(--mc-bg-card)",
                color: "#22d3ee",
              }}
            >
              <ChevronRight size={18} />
            </div>
            <span className="block text-[11px] font-semibold">View All</span>
          </button>
        </div>
      </div>

      <div
        id="mobile-videos-start"
        style={{
          background: isMobile ? "var(--mc-surface-gradient)" : DESKTOP_BG,
        }}
      >
        <div className="mx-auto max-w-[1600px] px-4 py-4 sm:px-4 sm:py-7 md:px-8 md:py-10">
          {loading ? (
            <div
              className="flex min-h-[60vh] items-center justify-center text-lg md:text-xl"
              style={{ color: isMobile ? "var(--mc-text-soft)" : "#ffffffb3" }}
            >
              Loading videos...
            </div>
          ) : (
            <div className="space-y-7 md:space-y-10">
              {!searchValue && topPicks.length > 0 && (
                <>
                  <VideoRowSection
                    title="Top Creator Videos"
                    slug=""
                    videos={topPicks}
                    showRanking={true}
                    onVideoOpen={handleVideoOpen}
                  />

                  {trendingVideos.length > 0 && (
                    <VideoRowSection
                      title="Trending Creator Videos"
                      slug=""
                      videos={trendingVideos}
                      onVideoOpen={handleVideoOpen}
                    />
                  )}
                </>
              )}

              {filteredSections.map((section) => (
                <VideoRowSection
                  key={section.slug || section.title}
                  title={section.title}
                  slug={section.slug}
                  videos={section.videos}
                  onVideoOpen={handleVideoOpen}
                />
              ))}

              {!filteredSections.length && !topPicks.length && (
                <div
                  className="flex min-h-[220px] items-center justify-center rounded-[24px] border px-4 text-center md:min-h-[280px] md:rounded-[28px]"
                  style={{
                    borderColor: isMobile
                      ? "var(--mc-border)"
                      : "rgba(255,255,255,0.10)",
                    background: isMobile
                      ? "var(--mc-bg-card)"
                      : "rgba(255,255,255,0.03)",
                  }}
                >
                  <div>
                    <h3
                      className="text-xl font-semibold md:text-2xl"
                      style={{
                        color: isMobile ? "var(--mc-text-main)" : "#fff",
                      }}
                    >
                      No creator videos found
                    </h3>
                    <p
                      className="mt-2 text-sm md:text-base"
                      style={{
                        color: isMobile ? "var(--mc-text-soft)" : "#ffffffb3",
                      }}
                    >
                      No approved creator videos available right now.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="hidden md:block">
        <Footer />
      </div>
      <div className="md:hidden">
        <MobileBottomNav />
      </div>
    </div>
  );
}

export default CreatorVideos;
