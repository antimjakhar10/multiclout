import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiStar, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import axios from "axios";

function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/testimonials`);
        setTestimonials(res.data.testimonials || []);
      } catch (error) {
        console.error("Error fetching testimonials", error);
      }
    };
    fetchTestimonials();
  }, []);

  const slideLeft = () => {
    const slider = document.getElementById("testimonial-slider");
    if (slider) slider.scrollBy({ left: -420, behavior: "smooth" });
  };

  const slideRight = () => {
    const slider = document.getElementById("testimonial-slider");
    if (slider) slider.scrollBy({ left: 420, behavior: "smooth" });
  };

  return (
    <section className="top-theme-bg py-24 relative overflow-hidden">
      
      {/* Curved background shape */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-black/10 border-b border-white/5 rounded-b-[100px] transform -translate-y-[100px]"></div>

      <div className="container-custom relative z-10 pt-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Learners <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-green-400">Love Multiclout</span>
          </motion.h2>
        </div>

        {testimonials.length === 0 ? (
          <div className="text-center text-slate-500 py-10">Loading testimonials...</div>
        ) : (
          <div className="relative group max-w-6xl mx-auto">
            {/* Scroll Buttons */}
            <button 
              onClick={slideLeft}
              className="hidden lg:flex absolute -left-16 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#0b1120] border border-slate-700 rounded-full items-center justify-center text-white z-20 hover:bg-teal-500 hover:border-transparent hover:scale-110 transition-all shadow-xl"
            >
              <FiChevronLeft size={24} />
            </button>
            <button 
              onClick={slideRight}
              className="hidden lg:flex absolute -right-16 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#0b1120] border border-slate-700 rounded-full items-center justify-center text-white z-20 hover:bg-teal-500 hover:border-transparent hover:scale-110 transition-all shadow-xl"
            >
              <FiChevronRight size={24} />
            </button>

            {/* Slider Container */}
            <div 
              id="testimonial-slider"
              className="flex overflow-x-auto gap-6 lg:gap-10 pb-12 hide-scrollbar snap-x snap-mandatory pt-12 px-4"
            >
              {testimonials.map((t, index) => (
                <motion.div 
                  key={t._id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="snap-center shrink-0 w-[320px] md:w-[400px] bg-[#0b1120] border border-slate-800 rounded-3xl p-8 relative hover:border-teal-500/40 transition-colors shadow-xl group my-4"
                >
                  {/* Profile Image hanging off the top */}
                  <div className="absolute -top-12 left-8">
                    <img 
                      src={t.image?.startsWith("http") ? t.image : `http://localhost:5000/${t.image}`} 
                      alt={t.name} 
                      className="w-24 h-24 rounded-2xl object-cover border-4 border-[#0b1120] shadow-xl group-hover:-translate-y-2 transition-transform duration-300 bg-slate-800"
                    />
                  </div>

                  <div className="flex gap-1 text-amber-400 mt-12 mb-6">
                    {[...Array(t.rating || 5)].map((_, i) => <FiStar key={i} className="fill-current" />)}
                  </div>

                  <p className="text-slate-300 text-lg leading-relaxed mb-8 italic">"{t.text}"</p>

                  <div className="mt-auto">
                    <h4 className="text-white font-bold text-lg">{t.name}</h4>
                    <p className="text-slate-500 text-sm">{t.city}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default TestimonialsSection;