import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiStar, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaQuoteLeft } from "react-icons/fa";
import axios from "axios";
import { API } from "../utils/api";
import { getImageUrl } from "../utils/videoHelpers";

function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);


  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await axios.get(`${API}/testimonials`);
        setTestimonials(res.data.testimonials || []);
      } catch (error) {
        console.error("Error fetching testimonials", error);
      }
    };
    fetchTestimonials();
  }, []);

  const slideLeft = () => {
    const slider = document.getElementById("testimonial-slider");
    if (slider) slider.scrollBy({ left: -380, behavior: "smooth" });
  };

  const slideRight = () => {
    const slider = document.getElementById("testimonial-slider");
    if (slider) slider.scrollBy({ left: 380, behavior: "smooth" });
  };

  return (
    <section className="bg-[#f8fbfc] pt-14 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[-8%] top-[10%] h-[280px] w-[280px] rounded-full bg-[#7bc0b0]/10 blur-[110px]" />
        <div className="absolute right-[-8%] bottom-[10%] h-[280px] w-[280px] rounded-full bg-sky-200/20 blur-[110px]" />
      </div>

      <div className="container-custom relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-flex rounded-full border border-[#d6ece6] bg-white px-4 py-2 text-sm font-semibold text-[#2d7084]">
            Trusted by Learners
          </span>

          <motion.h2
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mt-4 text-3xl md:text-5xl font-bold text-slate-900 leading-tight"
          >
            Learners Love{" "}
            <span className="bg-gradient-to-r from-[#2d7084] to-[#4d9a97] bg-clip-text text-transparent">
              Multiclout
            </span>
          </motion.h2>

          <p className="mt-4 max-w-2xl mx-auto text-slate-600 text-base md:text-lg">
            Real feedback from learners who found clarity, confidence, and
            practical growth through the platform.
          </p>
        </div>

        {testimonials.length === 0 ? (
          <div className="text-center text-slate-500 py-10">
            Loading testimonials...
          </div>
        ) : (
          <div className="relative">
            <button
              onClick={slideLeft}
              className="hidden lg:flex absolute -left-14 top-1/2 -translate-y-1/2 z-20 h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-[#2d7084] hover:bg-[#2d7084] hover:text-white"
            >
              <FiChevronLeft size={22} />
            </button>

            <button
              onClick={slideRight}
              className="hidden lg:flex absolute -right-14 top-1/2 -translate-y-1/2 z-20 h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-[#2d7084] hover:bg-[#2d7084] hover:text-white"
            >
              <FiChevronRight size={22} />
            </button>

            <div
              id="testimonial-slider"
              className="flex min-h-[332px] gap-6 overflow-x-auto px-2 pb-4 pt-3 hide-scrollbar snap-x snap-mandatory"
            >
              {testimonials.map((t, index) => {
                const image = getImageUrl(t.image);

                return (
                  <motion.div
                    key={t._id || index}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.07 }}
                    className="snap-start shrink-0 w-[320px] md:w-[370px] h-[290px] md:h-[300px] rounded-[28px] border border-slate-200 bg-white p-6 md:p-7 shadow-[0_18px_45px_rgba(15,23,42,0.05)] transition hover:-translate-y-1"
                  >
                    <div className="mb-5 flex min-h-[72px] items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={image}
                          alt={t.name}
                          onError={(e) => {
                            e.currentTarget.src = "/default-avatar.png";
                          }}
                          className="h-16 w-16 rounded-2xl object-cover border border-slate-200 bg-slate-100"
                        />
                        <div>
                          <h4 className="text-lg font-bold text-slate-900">
                            {t.name}
                          </h4>
                          <p className="text-sm text-slate-500">{t.city}</p>
                        </div>
                      </div>

                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f4fbf9] text-[#2d7084]">
                        <FaQuoteLeft />
                      </div>
                    </div>

                    <div className="mb-4 flex gap-1 text-amber-400">
                      {[...Array(t.rating || 5)].map((_, i) => (
                        <FiStar key={i} className="fill-current" />
                      ))}
                    </div>

                    <p className="min-h-[140px] text-slate-600 leading-7 text-[15px] md:text-base line-clamp-5">
                      &quot;{t.text}&quot;
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default TestimonialsSection;
