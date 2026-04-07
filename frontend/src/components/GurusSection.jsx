import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiVideo, FiEye } from "react-icons/fi";
import axios from "axios";

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
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/mentors`
        );
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
          scale: 0.85,
          x: "85%",
          zIndex: 20,
          opacity: 0.7,
          filter: "brightness(0.9) blur(1px)",
        };
      case 2:
      case -3:
        return {
          scale: 0.7,
          x: "150%",
          zIndex: 10,
          opacity: 0.4,
          filter: "brightness(0.8) blur(3px)",
        };
      case -1:
      case 4:
        return {
          scale: 0.85,
          x: "-85%",
          zIndex: 20,
          opacity: 0.7,
          filter: "brightness(0.9) blur(1px)",
        };
      case -2:
      case 3:
        return {
          scale: 0.7,
          x: "-150%",
          zIndex: 10,
          opacity: 0.4,
          filter: "brightness(0.8) blur(3px)",
        };
      default:
        return { opacity: 0, scale: 0 };
    }
  };

  return (
    <section className="top-theme-bg py-24 relative overflow-hidden flex flex-col items-center">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0b1120] opacity-50 pointer-events-none"></div>

      <div className="text-center relative z-10 mb-16 px-4">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-2 drop-shadow-lg">
          Multiclout Mentors
        </h2>
        <p className="text-slate-100 text-lg md:text-xl font-medium drop-shadow-md">
          Learn from the brightest minds in the industry
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500 relative z-10 font-medium">
          Loading mentors...
        </div>
      ) : gurus.length === 0 ? (
        <div className="text-center py-20 text-slate-500 relative z-10 font-medium">
          No mentors available.
        </div>
      ) : (
        <div className="relative w-full max-w-4xl h-[450px] flex items-center justify-center">
          <div className="relative w-[280px] md:w-[320px] h-[400px] perspective-1000">
            <AnimatePresence>
              {gurus.map((guru, index) => {
                const total = gurus.length;
                let offset = index - activeIndex;

                if (offset > total / 2) offset -= total;
                if (offset < -total / 2) offset += total;

                const theme = THEME_COLORS[index % THEME_COLORS.length];
                const isVisibleCard = Math.abs(offset) <= 2;
                const isActiveCard = offset === 0;

                return (
                  <motion.div
                    key={guru._id}
                    initial={false}
                    animate={getPositionVariant(offset)}
                    transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                    className="absolute top-0 left-0 w-full h-full"
                    onClick={() => {
                      if (!isActiveCard && isVisibleCard) {
                        setActiveIndex(index);
                      }
                    }}
                  >
                    <div
                      className={`w-full h-full rounded-[30px] overflow-hidden flex flex-col bg-white border border-slate-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] relative transition-all duration-300 ${
                        !isActiveCard && isVisibleCard
                          ? "cursor-pointer"
                          : "cursor-default"
                      }`}
                    >
                      <div
                        className="absolute top-0 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-b-xl font-bold text-[11px] text-white shadow-md z-20 uppercase tracking-wider"
                        style={{ backgroundColor: theme.hex }}
                      >
                        {guru.role}
                      </div>

                      <div
                        className={`absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b ${theme.bg} to-transparent opacity-60 z-0`}
                      ></div>

                      <div className="flex-1 flex flex-col items-center justify-center z-10 px-4 pt-6">
                        <img
                          src={
                            guru.image?.startsWith("http")
                              ? guru.image
                              : `http://localhost:5000/${guru.image}`
                          }
                          alt={guru.name}
                          className="h-[130px] w-[130px] object-cover rounded-full border-[4px] border-white shadow-lg z-10 relative bg-slate-100 mb-3"
                        />
                        <h3 className="text-xl font-extrabold text-slate-800 leading-tight text-center px-2">
                          {guru.name}
                        </h3>
                        <p className="text-[11px] font-bold text-slate-500 mt-1 uppercase tracking-widest">
                          {guru.role}
                        </p>
                      </div>

                      <div className="w-full mt-auto bg-slate-50/80 backdrop-blur-md border-t border-slate-200 px-4 py-4 flex items-center justify-around z-20">
                        <div className="flex flex-col items-center">
                          <FiVideo className="text-slate-400 mb-1" size={18} />
                          <span className="text-slate-800 font-bold text-sm tracking-wide">
                            150+
                          </span>
                          <span className="text-slate-500 text-[10px] uppercase tracking-widest">
                            Videos
                          </span>
                        </div>

                        <div className="w-px h-8 bg-slate-200"></div>

                        <div className="flex flex-col items-center">
                          <FiEye className="text-slate-400 mb-1" size={18} />
                          <span className="text-slate-800 font-bold text-sm tracking-wide">
                            2M+
                          </span>
                          <span className="text-slate-500 text-[10px] uppercase tracking-widest">
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