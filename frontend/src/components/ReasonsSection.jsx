import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiCheckCircle, FiTrendingUp, FiSmartphone, FiAward, FiStar } from "react-icons/fi";
import axios from "axios";

// Map strings returned from DB to icons
const getIcon = (iconStr) => {
  switch (iconStr?.toLowerCase()) {
    case 'trending': return <FiTrendingUp size={32} />;
    case 'mobile': return <FiSmartphone size={32} />;
    case 'award': return <FiAward size={32} />;
    case 'star': return <FiStar size={32} />;
    default: return <FiCheckCircle size={32} />;
  }
};

function ReasonsSection() {
  const [reasons, setReasons] = useState([]);

  useEffect(() => {
    const fetchReasons = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/reasons`);
        setReasons(res.data.reasons || []);
      } catch (error) {
        console.error("Error fetching reasons", error);
      }
    };
    fetchReasons();
  }, []);

  return (
    <section className="top-theme-bg py-24 relative overflow-hidden">
      <div className="container-custom relative z-10">
        
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block mb-4 border border-teal-500/30 bg-teal-500/10 px-4 py-1.5 rounded-full text-teal-400 font-semibold tracking-wide text-sm"
          >
            Why Multiclout?
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold text-white mb-4"
          >
            More reasons to join
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg max-w-2xl mx-auto"
          >
            We provide everything you need to succeed in your professional journey.
          </motion.p>
        </div>

        {reasons.length === 0 ? (
           <div className="text-center py-10 text-slate-500">Loading reasons...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reasons.map((reason, idx) => (
              <motion.div 
                key={reason._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-[#0f172a]/50 backdrop-blur-md border border-slate-800 p-8 rounded-3xl hover:bg-[#1e293b]/50 hover:border-teal-500/30 transition-all duration-300 group shadow-xl"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1f6a83] to-[#247987] flex items-center justify-center text-white mb-6 group-hover:-translate-y-2 transition-transform duration-300 shadow-[0_10px_20px_rgba(31,106,131,0.3)]">
                  {getIcon(reason.icon)}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-teal-400 transition-colors">{reason.title}</h3>
                <p className="text-slate-400 leading-relaxed">
                  {reason.desc}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default ReasonsSection;