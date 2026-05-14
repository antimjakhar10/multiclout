import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  LayoutGrid,
  Search,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import VideoRowSection from "../components/videos/VideoRowSection";
import FeaturedVideoSlider from "../components/videos/FeaturedVideoSlider";
import MobileBottomNav from "../components/videos/MobileBottomNav";
import { API } from "../utils/videoHelpers";
import useIsMobileView from "../hooks/useIsMobileView";

const HISTORY_KEY = "multiclout_watch_history";
const DESKTOP_BG =
  "radial-gradient(circle_at_top,rgba(77,154,151,0.12),transparent_28%),linear-gradient(180deg,#05111d_0%,#000000_35%,#000000_100%)";

function VideoCategoryPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobileView();

  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("");
  const [videos, setVideos] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [desktopSearchOpen, setDesktopSearchOpen] = useState(false);

  useEffect(() => {
    fetchCategoryVideos();
  }, [slug]);

  const fetchCategoryVideos = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("userToken") || localStorage.getItem("token");

      const res = await fetch(`${API}/videos/category/${slug}`, {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
      });

      const result = await res.json();

      if (result.success) {
        setCategoryName(result.categoryName || "");
        setVideos(result.videos || []);
      } else {
        setCategoryName("");
        setVideos([]);
      }
    } catch (error) {
      console.error("category videos fetch error:", error);
      setCategoryName("");
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const featuredVideos = useMemo(() => {
    return videos.filter((item) => item.featured).slice(0, 6);
  }, [videos]);

  const topVideos = useMemo(() => {
    return videos.filter((item) => item.topPick).slice(0, 10);
  }, [videos]);

  const filteredVideos = useMemo(() => {
    if (!searchValue.trim()) return videos;

    const query = searchValue.toLowerCase();

    return videos.filter((video) => {
      return (
        video.title?.toLowerCase().includes(query) ||
        video.description?.toLowerCase().includes(query) ||
        video.category?.toLowerCase().includes(query)
      );
    });
  }, [videos, searchValue]);

  const remainingVideos = useMemo(() => {
    if (searchValue.trim()) return filteredVideos;

    const topIds = new Set(topVideos.map((item) => item._id));
    return filteredVideos.filter((item) => !topIds.has(item._id));
  }, [filteredVideos, topVideos, searchValue]);

  const sectionTitle = useMemo(() => {
    if (searchValue.trim()) return `Results in ${categoryName}`;
    return `Only in ${categoryName}`;
  }, [searchValue, categoryName]);

  const saveToHistory = (video) => {
    try {
      const parsed = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
      const existing = Array.isArray(parsed) ? parsed : [];

      const filtered = existing.filter(
        (entry) => (entry?._id || entry?.slug) !== (video?._id || video?.slug)
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
      <div className="hidden md:block">
  <Navbar />
</div>

<div className="md:hidden">
  <Navbar />
</div>

<div className="relative mx-4 mt-3 md:hidden">
  <Search
    size={16}
    className="absolute left-4 top-1/2 -translate-y-1/2"
    style={{ color: "var(--mc-text-faint)" }}
  />
  <input
    type="text"
    value={searchValue}
    onChange={(e) => setSearchValue(e.target.value)}
    placeholder={`Search in ${categoryName || "category"}`}
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
                  placeholder={`Search in ${categoryName || "category"}`}
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
              onClick={() => navigate("/watch-videos/categories")}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-5 text-sm font-semibold text-white transition hover:border-[#4d9a97]/40"
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
        <div className="mx-auto max-w-[1600px] px-4 py-4 md:px-8 md:py-10">
          <div className="mb-4 flex items-center justify-between gap-3 md:hidden">
            <button
              onClick={() => navigate("/watch-videos")}
              className="inline-flex items-center gap-2 text-sm font-medium transition"
              style={{ color: "var(--mc-text-soft)" }}
            >
              <ChevronLeft size={18} />
              Back
            </button>

            <button
              onClick={() => navigate("/watch-videos/categories")}
              className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[13px] font-medium"
              style={{
                borderColor: "var(--mc-chip-border)",
                background: "var(--mc-chip-bg)",
                color: "var(--mc-text-main)",
              }}
            >
              <LayoutGrid size={16} />
              Categories
            </button>
          </div>

          {loading ? (
            <div
              className="flex min-h-[60vh] items-center justify-center text-lg md:text-xl"
              style={{ color: isMobile ? "var(--mc-text-soft)" : "#ffffffb3" }}
            >
              Loading...
            </div>
          ) : !videos.length ? (
            <div
              className="flex min-h-[260px] items-center justify-center rounded-[24px] border px-4 text-center md:min-h-[320px] md:rounded-[28px]"
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
                  style={{ color: isMobile ? "var(--mc-text-main)" : "#fff" }}
                >
                  No videos found
                </h3>
                <p
                  className="mt-2 text-sm md:text-base"
                  style={{
                    color: isMobile ? "var(--mc-text-soft)" : "#ffffffb3",
                  }}
                >
                  Is category me abhi videos nahi hain.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-8 md:space-y-12">
              {!searchValue && featuredVideos.length > 0 && (
                <div className="hidden md:block">
                  <FeaturedVideoSlider videos={featuredVideos} />
                </div>
              )}

              {!searchValue && topVideos.length > 0 && (
                <VideoRowSection
                  title={`Top 10 in ${categoryName}`}
                  slug=""
                  videos={topVideos}
                  showRanking={true}
                  onVideoOpen={handleVideoOpen}
                />
              )}

              {remainingVideos.length > 0 && (
                <VideoRowSection
                  title={sectionTitle}
                  slug=""
                  videos={remainingVideos}
                  onVideoOpen={handleVideoOpen}
                />
              )}

              {searchValue && !filteredVideos.length && (
                <div
                  className="flex min-h-[240px] items-center justify-center rounded-[24px] border px-4 text-center md:min-h-[280px] md:rounded-[28px]"
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
                      style={{ color: isMobile ? "var(--mc-text-main)" : "#fff" }}
                    >
                      No matching videos
                    </h3>
                    <p
                      className="mt-2 text-sm md:text-base"
                      style={{
                        color: isMobile ? "var(--mc-text-soft)" : "#ffffffb3",
                      }}
                    >
                      Search change karke dekh lo.
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
      <MobileBottomNav />
    </div>
  );
}

export default VideoCategoryPage;