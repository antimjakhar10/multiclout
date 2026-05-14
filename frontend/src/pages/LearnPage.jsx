import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Search } from "lucide-react";
import LearnHeader from "../components/learn/LearnHeader";
import LearnBottomNav from "../components/learn/LearnBottomNav";
import VideoRowSection from "../components/videos/VideoRowSection";
import { API } from "../utils/videoHelpers";

function LearnPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [data, setData] = useState({
    topPicks: [],
    categories: [],
    sections: [],
  });

  useEffect(() => {
    fetchLearnPage();
  }, []);

  const fetchLearnPage = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/videos/watch-page`);
      const result = await res.json();

      if (result?.success) {
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
      console.error("learn page fetch error:", error);
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
          const label = item.name || item.title || item.slug || `Category ${index + 1}`;
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

    return mapped.slice(0, 8);
  }, [data.categories]);

  const filteredSections = useMemo(() => {
    let sections = Array.isArray(data.sections) ? [...data.sections] : [];

    if (activeCategory !== "All") {
      sections = sections.filter((section) => {
        const sectionTitle = section?.title?.toLowerCase?.() || "";
        const sectionSlug = section?.slug?.toLowerCase?.() || "";
        const active = activeCategory.toLowerCase();

        const sectionMatch = sectionTitle === active || sectionSlug === active;

        const videoMatch = (section?.videos || []).some((video) => {
          const cat = video?.category?.toLowerCase?.() || "";
          return cat === active;
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
            video?.title?.toLowerCase().includes(query) ||
            video?.description?.toLowerCase().includes(query) ||
            video?.category?.toLowerCase().includes(query)
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

  return (
    <div className="min-h-screen bg-[#05111d] text-white pb-24">
      <LearnHeader />

      <div className="mx-auto max-w-[1600px] px-4 pt-5 sm:px-6 lg:px-8">
        {/* Search */}
        <div className="mb-4">
  <div className="relative">
    <Search
      size={17}
      className="absolute left-4 top-1/2 -translate-y-1/2 text-white/45"
    />
    <input
      type="text"
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
      placeholder="Search videos, reels, categories..."
      className="h-12 w-full rounded-[18px] border border-white/10 bg-white/[0.06] pl-11 pr-4 text-[14px] text-white placeholder:text-white/45 outline-none focus:border-cyan-400/40"
    />
  </div>
</div>

        {/* Categories */}
        <div className="mb-7 flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setActiveCategory("All")}
           className={`whitespace-nowrap rounded-full border px-4 py-2.5 text-[13px] font-medium transition ${
  activeCategory === "All"
    ? "border-cyan-400 bg-cyan-400 text-[#06101d]"
    : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
}`}
          >
            All
          </button>

          {normalizedCategories.map((category) => (
            <button
              key={category.key}
              onClick={() => setActiveCategory(category.value)}
              className={`whitespace-nowrap rounded-full border px-4 py-2.5 text-[13px] font-medium transition ${
  activeCategory === category.value
    ? "border-cyan-400 bg-cyan-400 text-[#06101d]"
    : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
}`}
            >
              {category.label}
            </button>
          ))}

          <button
            onClick={() => navigate("/watch-videos/categories")}
           className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-[13px] font-medium text-cyan-300 transition hover:bg-white/10"
          >
            View All
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex min-h-[55vh] items-center justify-center text-lg text-white/70">
            Loading videos...
          </div>
        ) : (
          <div className="space-y-8">
            {!searchValue && topPicks.length > 0 && (
              <VideoRowSection
                title="Multiclout Top 10"
                slug=""
                videos={topPicks}
                showRanking={true}
              />
            )}

            {filteredSections.map((section) => (
              <VideoRowSection
                key={section.slug || section.title}
                title={section.title}
                slug={section.slug}
                videos={section.videos}
              />
            ))}

            {!filteredSections.length && !topPicks.length && (
              <div className="flex min-h-[220px] items-center justify-center rounded-[24px] border border-white/10 bg-white/[0.03] px-4 text-center">
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    No videos found
                  </h3>
                  <p className="mt-2 text-sm text-white/65">
                    Abhi videos add karne padenge.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <LearnBottomNav />
    </div>
  );
}

export default LearnPage;