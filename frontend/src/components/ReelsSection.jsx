import { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { FiPlay } from "react-icons/fi";
import axios from "axios";

function ReelsSection() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All Categories");

  const scrollRef = useRef(null);
  const autoScrollRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const pauseAutoRef = useRef(false);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const IMAGE_BASE = API_BASE.endsWith("/api")
    ? API_BASE.replace("/api", "")
    : API_BASE;

  useEffect(() => {
    const fetchReels = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/reels`);
        setReels(res.data.reels || []);
      } catch (error) {
        console.error("Error fetching reels", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReels();
  }, [API_BASE]);

  const dynamicCategories = useMemo(() => {
    const cleanCategories = reels
      .map((r) => r.category?.trim())
      .filter(Boolean);

    return ["All Categories", ...new Set(cleanCategories)];
  }, [reels]);

  const filteredReels = useMemo(() => {
    if (activeCategory === "All Categories") return reels;

    return reels.filter(
      (r) =>
        r.category?.trim()?.toLowerCase() ===
        activeCategory.trim().toLowerCase()
    );
  }, [reels, activeCategory]);

  const displayReels = useMemo(() => {
    if (!filteredReels.length) return [];
    return [...filteredReels, ...filteredReels];
  }, [filteredReels]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || filteredReels.length === 0) return;

    pauseAutoRef.current = false;

    const autoScroll = () => {
      if (!container || pauseAutoRef.current) return;

      container.scrollLeft += 0.45;

      const halfWidth = container.scrollWidth / 2;
      if (container.scrollLeft >= halfWidth) {
        container.scrollLeft = 0;
      }
    };

    autoScrollRef.current = setInterval(autoScroll, 16);

    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    };
  }, [filteredReels]);

  const handleMouseDown = (e) => {
    const container = scrollRef.current;
    if (!container) return;

    isDraggingRef.current = true;
    pauseAutoRef.current = true;
    startXRef.current = e.pageX - container.offsetLeft;
    scrollLeftRef.current = container.scrollLeft;
  };

  const handleMouseMove = (e) => {
    const container = scrollRef.current;
    if (!container || !isDraggingRef.current) return;

    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startXRef.current) * 1.2;
    container.scrollLeft = scrollLeftRef.current - walk;

    const halfWidth = container.scrollWidth / 2;
    if (container.scrollLeft >= halfWidth) {
      container.scrollLeft = 0;
      scrollLeftRef.current = 0;
      startXRef.current = x;
    }
    if (container.scrollLeft <= 0) {
      container.scrollLeft = halfWidth;
      scrollLeftRef.current = halfWidth;
      startXRef.current = x;
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    setTimeout(() => {
      pauseAutoRef.current = false;
    }, 800);
  };

  const handleMouseLeave = () => {
    isDraggingRef.current = false;
    setTimeout(() => {
      pauseAutoRef.current = false;
    }, 800);
  };

  return (
    <section className="top-theme-bg py-16 md:py-20 px-4 md:px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#08111f]/30 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl h-[260px] bg-[#1f6a83]/10 blur-[130px] pointer-events-none rounded-full"></div>

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-3">
            What&apos;s Waiting For You?
          </h2>
          <p className="text-slate-300 text-sm md:text-lg max-w-2xl mx-auto">
            Daily short videos, multiple categories, and trusted mentors to help you grow faster.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3 mb-10 max-w-5xl mx-auto">
          {dynamicCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 md:px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 border ${
                activeCategory === cat
                  ? "bg-white text-[#0b1120] border-white shadow-[0_8px_26px_rgba(255,255,255,0.16)]"
                  : "bg-transparent text-slate-200 border-slate-600 hover:border-slate-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400 font-medium">
            Loading reels...
          </div>
        ) : filteredReels.length === 0 ? (
          <div className="text-center py-12 text-slate-400 font-medium">
            No reels available for this category.
          </div>
        ) : (
          <div className="relative">
            <div
              ref={scrollRef}
              onMouseEnter={() => {
                pauseAutoRef.current = true;
              }}
              onMouseLeave={handleMouseLeave}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              className="flex gap-4 overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing select-none py-2"
            >
              {displayReels.map((reel, idx) => {
                const thumbnail = reel.thumbnail?.startsWith("http")
                  ? reel.thumbnail
                  : `${IMAGE_BASE}/${reel.thumbnail}`;

                return (
                  <motion.div
                    key={`${reel._id || idx}-${idx}`}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35 }}
                    className="shrink-0 w-[170px] sm:w-[180px] md:w-[190px] lg:w-[200px]"
                  >
                    <div className="relative h-[270px] sm:h-[285px] md:h-[300px] rounded-[24px] overflow-hidden bg-[#07101d] border border-white/10 shadow-[0_14px_40px_rgba(0,0,0,0.24)] group cursor-pointer">
                      <img
                        src={thumbnail}
                        alt={reel.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        draggable="false"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-[#050816]/45 to-transparent"></div>

                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-md border border-white/15 text-white text-[10px] font-semibold">
                          <FiPlay size={10} fill="currentColor" />
                          {reel.duration || "Short"}
                        </span>
                      </div>

                      {reel.category && (
                        <div className="absolute top-3 right-3">
                          <span className="px-2.5 py-1 rounded-full bg-teal-500/15 backdrop-blur-md border border-teal-300/20 text-teal-100 text-[10px] font-semibold line-clamp-1 max-w-[90px]">
                            {reel.category}
                          </span>
                        </div>
                      )}

                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center shadow-2xl">
                          <FiPlay
                            size={18}
                            className="text-white ml-0.5"
                            fill="currentColor"
                          />
                        </div>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-white font-extrabold text-lg leading-tight line-clamp-3 mb-3">
                          {reel.title}
                        </h3>

                        <div className="flex items-center justify-between gap-2">
                          <div className="w-10 h-1 rounded-full bg-teal-400 shadow-[0_0_12px_rgba(45,212,191,0.55)] group-hover:w-16 transition-all duration-300"></div>
                          <span className="text-slate-300 text-[11px] font-medium whitespace-nowrap">
                            Watch now
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <style>{`
              .no-scrollbar {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
              .no-scrollbar::-webkit-scrollbar {
                display: none;
              }
            `}</style>
          </div>
        )}
      </div>
    </section>
  );
}

export default ReelsSection;