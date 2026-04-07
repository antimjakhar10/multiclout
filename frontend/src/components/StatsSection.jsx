import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiUsers, FiVideo, FiUserCheck, FiTarget } from "react-icons/fi";
import axios from "axios";

const getStatIcon = (label) => {
  const l = label.toLowerCase();
  if (l.includes("learn") || l.includes("student")) return <FiUsers size={28} />;
  if (l.includes("video") || l.includes("course") || l.includes("lesson")) return <FiVideo size={28} />;
  if (l.includes("mentor") || l.includes("guru") || l.includes("teacher")) return <FiUserCheck size={28} />;
  return <FiTarget size={28} />;
};

function StatsSection() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/stats`);
        setStats(res.data.stats || []);
      } catch (error) {
        console.error("Error fetching stats", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <section className="bg-black py-12 relative border-y border-white/5">
      <div className="container-custom relative z-10 flex justify-center px-4">
        
        <div className="bg-[#111111] border border-white/10 rounded-[35px] py-6 px-8 md:px-12 w-full max-w-4xl shadow-2xl">
          
          {stats.length === 0 ? (
             <div className="text-center text-slate-500 font-medium">Loading stats...</div>
          ) : (
            <div className="flex flex-col md:flex-row items-center justify-around gap-6 relative">
              {stats.map((stat, index) => (
                <div key={stat._id || index} className="flex flex-col flex-1 w-full md:w-auto">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 group justify-center md:justify-center"
                  >
                    <div className="w-[50px] h-[50px] rounded-full border-2 border-[#8b5cf6]/60 bg-[#8b5cf6]/10 flex flex-shrink-0 items-center justify-center text-[#a78bfa] group-hover:scale-110 group-hover:bg-[#8b5cf6] group-hover:text-white transition-all duration-300">
                      {getStatIcon(stat.label)}
                    </div>
                    <div className="flex flex-col text-left">
                      <h3 className="text-2xl md:text-[28px] leading-none font-bold text-white mb-1 tracking-tight">
                        {stat.value}
                      </h3>
                      <p className="text-slate-400 font-medium text-xs md:text-sm capitalize">{stat.label}</p>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </section>
  );
}

export default StatsSection;