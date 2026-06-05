import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FiPlay,
  FiYoutube,
  FiTrendingUp,
  FiBriefcase,
  FiActivity,
  FiSearch,
} from "react-icons/fi";
import {
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineShareAlt,
} from "react-icons/ai";
import { HiOutlineAcademicCap } from "react-icons/hi";
import { BsInstagram, BsCameraVideo, BsBank } from "react-icons/bs";
import { MdOutlineHealthAndSafety, MdOutlineAutoGraph } from "react-icons/md";
import { RiMoneyDollarCircleLine, RiBookOpenLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { formatSocialCount } from "../utils/formatCount";
import { API, getImageUrl } from "../utils/videoHelpers";

function normalizeText(value = "") {
  return value.trim().toLowerCase();
}

function getCategoryIcon(category = "") {
  const key = normalizeText(category);
  const iconClass = "text-[15px] sm:text-base";

  if (key.includes("youtube")) return <FiYoutube className={iconClass} />;
  if (key.includes("instagram")) return <BsInstagram className={iconClass} />;
  if (key.includes("business")) return <FiBriefcase className={iconClass} />;
  if (key.includes("finance")) return <BsBank className={iconClass} />;
  if (key.includes("share market"))
    return <MdOutlineAutoGraph className={iconClass} />;
  if (key.includes("stock")) return <FiTrendingUp className={iconClass} />;
  if (key.includes("health"))
    return <MdOutlineHealthAndSafety className={iconClass} />;
  if (key.includes("knowledge"))
    return <RiBookOpenLine className={iconClass} />;
  if (key.includes("motivation"))
    return <HiOutlineAcademicCap className={iconClass} />;
  if (key.includes("video editing"))
    return <BsCameraVideo className={iconClass} />;
  if (key.includes("earning"))
    return <RiMoneyDollarCircleLine className={iconClass} />;
  if (key.includes("career")) return <FiActivity className={iconClass} />;

  return <HiOutlineAcademicCap className={iconClass} />;
}

function ReelsSection() {
  const [videos, setVideos] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [categorySearch, setCategorySearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideosData = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`${API}/videos/watch-page`);
        const result = res.data || {};

        const topPicks = result.topPicks || [];
        const fetchedCategories = result.categories || [];

        setVideos(topPicks);

        const safeCategories = [
          "All Categories",
          ...fetchedCategories
            .map((item) => item?.name?.trim())
            .filter(Boolean)
            .filter((value, index, arr) => arr.indexOf(value) === index),
        ];

        setAllCategories(safeCategories);
      } catch (error) {
        console.error("Error fetching homepage videos", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideosData();
  }, []);

  const searchedCategories = useMemo(() => {
    if (!categorySearch.trim()) return allCategories;

    return allCategories.filter((cat) =>
      normalizeText(cat).includes(normalizeText(categorySearch)),
    );
  }, [allCategories, categorySearch]);

  const filteredVideos = useMemo(() => {
    if (activeCategory === "All Categories") return videos;

    return videos.filter(
      (video) =>
        normalizeText(video.category) === normalizeText(activeCategory),
    );
  }, [videos, activeCategory]);

  const marqueeCategories = useMemo(() => {
    return allCategories.filter(
      (cat) => normalizeText(cat) !== "all categories",
    );
  }, [allCategories]);

  const rowOne = useMemo(() => {
    const half = Math.ceil(marqueeCategories.length / 2);
    return marqueeCategories.slice(0, half);
  }, [marqueeCategories]);

  const rowTwo = useMemo(() => {
    const half = Math.ceil(marqueeCategories.length / 2);
    return marqueeCategories.slice(half);
  }, [marqueeCategories]);

  const openVideoDetail = (video) => {
    if (video?.slug) {
      navigate(`/watch-videos/${video.slug}`);
      return;
    }

    console.warn("Video slug missing:", video);
  };

  return (
    <section className="relative overflow-hidden bg-black px-4 py-10 sm:px-6 md:py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(45,112,132,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(77,154,151,0.10),transparent_28%)]" />

      <div className="relative mx-auto max-w-[1440px]">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mb-8 text-center"
        >
          <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#41d7c6] shadow-sm sm:text-[11px]">
            Explore Topics
          </span>

          <h2 className="mx-auto mt-4 max-w-[800px] text-[28px] font-extrabold leading-[1.15] text-white sm:text-[36px] md:text-[46px]">
            What&apos;s waiting for <span className="text-[#41d7c6]">you?</span>
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-[14px] text-slate-300 sm:text-[15px]">
            Pick a topic and start learning from India&apos;s top mentors
          </p>
        </motion.div>

        <div className="mx-auto mb-6 max-w-[520px]">
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <FiSearch size={18} />
            </span>

            <input
              type="text"
              value={categorySearch}
              onChange={(e) => setCategorySearch(e.target.value)}
              placeholder="Search categories..."
              className="h-[50px] w-full rounded-full border border-white/10 bg-white/5 pl-12 pr-4 text-[15px] text-white outline-none transition placeholder:text-slate-500 focus:border-[#41d7c6]/50 focus:bg-white/[0.07]"
            />
          </div>

          {categorySearch.trim() && searchedCategories.length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              {searchedCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat);
                    setCategorySearch("");
                  }}
                  className={`inline-flex h-[44px] items-center gap-2 rounded-full border px-4 text-[13px] font-semibold transition-all ${
                    normalizeText(activeCategory) === normalizeText(cat)
                      ? "border-[#41d7c6] bg-[#41d7c6] text-[#07111a]"
                      : "border-white/10 bg-white/5 text-white hover:border-white/20 hover:bg-white/10"
                  }`}
                >
                  <span>{getCategoryIcon(cat)}</span>
                  <span>{cat}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {!categorySearch.trim() && (
          <div className="mb-8 space-y-3 overflow-hidden px-2 sm:px-4">
            <div className="marquee-wrapper">
              <div className="marquee-track">
                {[...rowOne, ...rowOne, ...rowOne].map((cat, index) => (
                  <button
                    key={`row1-${cat}-${index}`}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`inline-flex h-[44px] items-center gap-2 rounded-full border px-4 text-[13px] font-semibold whitespace-nowrap transition-all ${
                      normalizeText(activeCategory) === normalizeText(cat)
                        ? "border-[#41d7c6] bg-[#41d7c6] text-[#07111a] shadow-[0_10px_25px_rgba(65,215,198,0.18)]"
                        : "border-white/10 bg-white/5 text-white hover:border-white/20 hover:bg-white/10"
                    }`}
                  >
                    <span className="text-[15px]">{getCategoryIcon(cat)}</span>
                    <span>{cat}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="marquee-wrapper">
              <div className="marquee-track marquee-track-reverse">
                {[...rowTwo, ...rowTwo, ...rowTwo].map((cat, index) => (
                  <button
                    key={`row2-${cat}-${index}`}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`inline-flex h-[46px] items-center gap-2 rounded-full border px-5 text-[14px] font-semibold whitespace-nowrap transition-all ${
                      normalizeText(activeCategory) === normalizeText(cat)
                        ? "border-[#41d7c6] bg-[#41d7c6] text-[#07111a] shadow-[0_10px_25px_rgba(65,215,198,0.18)]"
                        : "border-white/10 bg-white/5 text-white hover:border-white/20 hover:bg-white/10"
                    }`}
                  >
                    <span className="text-[15px]">{getCategoryIcon(cat)}</span>
                    <span>{cat}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mb-6 flex items-center gap-4">
          <h3 className="whitespace-nowrap text-[28px] font-extrabold text-white sm:text-[34px]">
            Trending Videos
          </h3>
          <div className="h-px w-full bg-white/10" />
          <span className="whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-[#41d7c6]">
            {filteredVideos.length} videos
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-base font-medium text-slate-400">
            Loading videos...
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="py-12 text-center text-base font-medium text-slate-400">
            No videos available for this category.
          </div>
        ) : (
          <div
            className="overflow-x-auto overflow-y-hidden pb-3 no-scrollbar relative"
            style={{
              transform: "translateZ(0)",
              WebkitTransform: "translateZ(0)",
            }}
          >
            <div className="flex w-max gap-4 lg:gap-5 pr-4">
              {filteredVideos.map((video, idx) => (
                <div
                  key={`${video._id || idx}-${idx}`}
                  className="group relative w-[200px] shrink-0 sm:w-[255px] md:w-[265px] lg:w-[272px]"
                >
                  <button
                    type="button"
                    onClick={() => openVideoDetail(video)}
                    className="relative block h-[360px] w-full overflow-hidden rounded-[28px] bg-[#0c1726] text-left shadow-[0_12px_30px_rgba(17,41,74,0.14)] transition-transform duration-300 hover:-translate-y-1 sm:h-[430px]"
                  >
                    <img
                      src={getImageUrl(video.thumbnail)}
                      alt={video.title}
                      loading="lazy"
                      draggable="false"
                      className="h-full w-full object-cover transition-transform duration-500 will-change-transform group-hover:scale-[1.015]"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#08111d]/95 via-[#08111d]/20 to-transparent" />

                    <div className="absolute left-3 top-3 flex items-center gap-2">
                      <span className="rounded-full bg-[#16365e] px-3 py-1.5 text-[12px] font-bold text-white shadow-sm">
                        {video.duration || "2 mins"}
                      </span>
                    </div>

                    <div className="absolute right-3 top-3">
                      <span className="rounded-full bg-[#19b9de] px-3 py-1.5 text-[12px] font-bold text-white shadow-sm">
                        {video.category || "Video"}
                      </span>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white backdrop-blur-md shadow-lg">
                        <FiPlay size={22} className="ml-0.5" />
                      </span>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-center justify-between gap-2 px-1 text-white">
                        <span className="flex items-center gap-1.5 text-[13px] font-semibold text-white/95 drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]">
                          <AiOutlineEye size={17} />
                          {formatSocialCount(video.views)}
                        </span>

                        <span className="flex items-center gap-1.5 text-[13px] font-semibold text-white/95 drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]">
                          <AiOutlineHeart size={17} />
                          {formatSocialCount(video.likes)}
                        </span>

                        <span className="flex items-center gap-1.5 text-[13px] font-semibold text-white/95 drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]">
                          <AiOutlineShareAlt size={17} />
                          {formatSocialCount(video.shares)}
                        </span>
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <style>{`
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }

          .marquee-wrapper {
            overflow: hidden;
            width: 100%;
            position: relative;
          }

          .marquee-track {
  display: flex;
  align-items: center;
  gap: 16px;
  width: max-content;
  padding-right: 16px;

  will-change: transform;
  transform: translate3d(0,0,0);

  backface-visibility: hidden;
  perspective: 1000px;

  animation: marqueeLeft 42s linear infinite;
}

          .marquee-track-reverse {
            animation: marqueeRight 42s linear infinite;
          }

          .marquee-wrapper,
.marquee-track,
.no-scrollbar {
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}

.marquee-track {
  contain: content;
}

          @keyframes marqueeLeft {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-33.333%);
            }
          }

          @keyframes marqueeRight {
            0% {
              transform: translateX(-33.333%);
            }
            100% {
              transform: translateX(0);
            }
          }
        `}</style>
      </div>
    </section>
  );
}

export default ReelsSection;
