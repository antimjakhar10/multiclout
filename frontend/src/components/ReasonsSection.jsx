import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiCheckCircle,
  FiTrendingUp,
  FiSmartphone,
  FiAward,
  FiStar,
} from "react-icons/fi";
import axios from "axios";
import { API } from "../utils/api";

const getIcon = (iconStr) => {
  switch (iconStr?.toLowerCase()) {
    case "trending":
      return <FiTrendingUp size={22} />;
    case "mobile":
      return <FiSmartphone size={22} />;
    case "award":
      return <FiAward size={22} />;
    case "star":
      return <FiStar size={22} />;
    default:
      return <FiCheckCircle size={24} />;
  }
};

function ReasonsSection() {
  const [reasons, setReasons] = useState([]);

  useEffect(() => {
    const fetchReasons = async () => {
      try {
        const res = await axios.get(
          `${API}/reasons`
        );
        setReasons(res.data.reasons || []);
      } catch (error) {
        console.error("Error fetching reasons", error);
      }
    };

    fetchReasons();
  }, []);

  return (
    <section className="relative overflow-hidden bg-white pt-12 pb-16">
      <div className="container-custom relative z-10">
        <div className="mb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 inline-block rounded-full border border-[#d6ece6] bg-[#f4fbf9] px-4 py-2 text-sm font-semibold tracking-wide text-[#2d7084]"
          >
            Why Multiclout?
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="mb-3 text-2xl font-bold text-slate-900 md:text-4xl"
          >
            More reasons to join
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.16 }}
            className="mx-auto max-w-xl text-base text-slate-600"
          >
            Everything you need to learn, grow, and build confidence in one clean
            platform.
          </motion.p>
        </div>

        {reasons.length === 0 ? (
          <div className="py-10 text-center text-slate-500">
            Loading reasons...
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {reasons.map((reason, idx) => (
              <motion.div
                key={reason._id}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="rounded-[22px] border border-slate-200 bg-[#f8fbfc] p-5 sm:p-5  transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(15,23,42,0.06)]"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#2d7084] to-[#4d9a97] text-white shadow-[0_6px_18px_rgba(45,112,132,0.22)]">
                    {getIcon(reason.icon)}
                  </div>

                  <div className="flex-1">
                   <h3 className="text-[18px] font-semibold leading-snug text-slate-900">
                      {reason.title}
                    </h3>

                    <p className="mt-1 text-sm leading-relaxed text-slate-600">
                      {reason.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default ReasonsSection;