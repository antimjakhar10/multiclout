import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiVideo, FiEye } from "react-icons/fi";
import axios from "axios";
import { API } from "../utils/api";
import { getImageUrl } from "../utils/videoHelpers";

const THEME_COLORS = [
  { hex: "#ef4444", bg: "from-red-500/20" },
  { hex: "#22c55e", bg: "from-green-500/20" },
  { hex: "#3b82f6", bg: "from-blue-500/20" },
  { hex: "#a855f7", bg: "from-purple-500/20" },
  { hex: "#14b8a6", bg: "from-teal-500/20" },
];

function GurusSection() {
  const [activeIndex, setActiveIndex] = useState(2);
  const [gurus, setGurus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGurus = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API}/mentors`);
        setGurus(res.data.mentors || []);

        if (res.data.mentors?.length > 0) {
          setActiveIndex(Math.floor(res.data.mentors.length / 2));
        }
      } catch (error) {
        console.error("Error fetching mentors", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGurus();
  }, []);

  const getPositionVariant = (offset) => {
    switch (offset) {
      case 0:
        return {
          scale: 1,
          x: "0%",
          zIndex: 30,
          opacity: 1,
          filter: "brightness(1) blur(0px)",
        };
      case 1:
      case -4:
        return {
          scale: 0.86,
          x: "82%",
          zIndex: 20,
          opacity: 0.72,
          filter: "brightness(0.95) blur(1px)",
        };
      case 2:
      case -3:
        return {
          scale: 0.72,
          x: "145%",
          zIndex: 10,
          opacity: 0.4,
          filter: "brightness(0.85) blur(3px)",
        };
      case -1:
      case 4:
        return {
          scale: 0.86,
          x: "-82%",
          zIndex: 20,
          opacity: 0.72,
          filter: "brightness(0.95) blur(1px)",
        };
      case -2:
      case 3:
        return {
          scale: 0.72,
          x: "-145%",
          zIndex: 10,
          opacity: 0.4,
          filter: "brightness(0.85) blur(3px)",
        };
      default:
        return { opacity: 0, scale: 0 };
    }
  };

  return (
    <section className="relative flex flex-col items-center overflow-hidden bg-black px-4 pb-14 pt-10 md:px-6 md:pb-20 md:pt-12">
      <div className="relative z-10 mb-6 px-4 text-center md:mb-8">
        <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-semibold text-[#7bc0b0] sm:text-sm">
          Meet Our Mentors
        </span>

        <h2 className="mb-3 mt-4 text-[32px] font-extrabold leading-[1.1] text-white sm:text-[42px] md:text-[54px]">
          Multiclout Mentors
        </h2>

        <p className="mx-auto max-w-2xl text-[15px] font-medium leading-relaxed text-slate-300 sm:text-[17px] md:text-[18px]">
          Learn from trusted experts with practical industry experience.
        </p>
      </div>

      {loading ? (
        <div className="relative z-10 py-20 text-center font-medium text-slate-500">
          Loading mentors...
        </div>
      ) : gurus.length === 0 ? (
        <div className="relative z-10 py-20 text-center font-medium text-slate-500">
          No mentors available.
        </div>
      ) : (
        <div className="relative flex h-[360px] w-full max-w-5xl items-center justify-center sm:h-[400px] md:h-[440px]">
          <div className="perspective-1000 relative h-[360px] w-[250px] sm:h-[400px] sm:w-[290px] md:h-[440px] md:w-[350px]">
            <AnimatePresence>
              {gurus.map((guru, index) => {
                const total = gurus.length;
                let offset = index - activeIndex;

                if (offset > total / 2) offset -= total;
                if (offset < -total / 2) offset += total;

                const theme = THEME_COLORS[index % THEME_COLORS.length];
                const isVisibleCard = Math.abs(offset) <= 2;
                const isActiveCard = offset === 0;

                const image = getImageUrl(guru.image);

                return (
                  <motion.div
                    key={guru._id}
                    initial={false}
                    animate={getPositionVariant(offset)}
                    transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                    className="absolute left-0 top-0 h-full w-full"
                    onClick={() => {
                      if (!isActiveCard && isVisibleCard) setActiveIndex(index);
                    }}
                  >
                    <div
                      className={`relative flex h-full w-full flex-col overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_25px_80px_rgba(0,0,0,0.25)] md:rounded-[30px] ${
                        !isActiveCard && isVisibleCard
                          ? "cursor-pointer"
                          : "cursor-default"
                      }`}
                    >
                      <div
                        className="absolute left-1/2 top-0 z-20 -translate-x-1/2 rounded-b-xl px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-md sm:px-5 sm:text-[11px]"
                        style={{ backgroundColor: theme.hex }}
                      >
                        {guru.role || "Mentor"}
                      </div>

                      <div
                        className={`absolute left-0 top-0 z-0 h-1/2 w-full bg-gradient-to-b ${theme.bg} to-transparent opacity-60`}
                      />

                      <div className="z-10 flex flex-1 flex-col items-center justify-start px-4 pt-7 sm:px-5 sm:pt-8 md:px-6 md:pt-9">
                        {image ? (
                          <img
                            src={image}
                            alt={guru.name}
                            className="mt-2 mb-2 h-[110px] w-[110px] rounded-full border-[4px] border-white bg-slate-100 object-cover shadow-lg sm:h-[128px] sm:w-[128px] md:h-[150px] md:w-[150px]"
                          />
                        ) : (
                          <div className="mt-2 mb-2 h-[110px] w-[110px] rounded-full border-[4px] border-white bg-slate-100 shadow-lg sm:h-[128px] sm:w-[128px] md:h-[150px] md:w-[150px]" />
                        )}

                        <h3 className="px-2 text-center text-[22px] font-extrabold leading-[1.1] text-slate-800 sm:text-[24px] md:text-[26px]">
                          {guru.name}
                        </h3>

                        {guru.bio ? (
                          <p className="mt-1.5 line-clamp-3 px-2 text-center text-[14px] leading-[1.45] text-slate-500 sm:px-3 sm:text-[14px] md:px-4 md:text-[15px]">
                            {guru.bio}
                          </p>
                        ) : null}
                      </div>

                      <div className="z-20 mt-auto flex w-full items-center justify-around border-t border-slate-200 bg-slate-50 px-3 py-2.5 sm:px-4 sm:py-3">
                        <div className="flex flex-col items-center">
                          <FiVideo className="mb-1 text-slate-400" size={16} />
                          <span className="text-sm font-bold tracking-wide text-slate-800">
                            {guru.videosCount || "0"}
                          </span>
                          <span className="text-[9px] uppercase tracking-widest text-slate-500 sm:text-[10px]">
                            Videos
                          </span>
                        </div>

                        <div className="h-7 w-px bg-slate-200 sm:h-8"></div>

                        <div className="flex flex-col items-center">
                          <FiEye className="mb-1 text-slate-400" size={16} />
                          <span className="text-sm font-bold tracking-wide text-slate-800">
                            {guru.viewsCount || "0"}
                          </span>
                          <span className="text-[9px] uppercase tracking-widest text-slate-500 sm:text-[10px]">
                            Views
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}
    </section>
  );
}

export default GurusSection;