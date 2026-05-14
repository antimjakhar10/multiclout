import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiMinus } from "react-icons/fi";
import axios from "axios";
import { API } from "../utils/api";

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await axios.get(
          `${API}/faqs`
        );
        setFaqs(res.data.faqs || []);
      } catch (error) {
        console.error("Error fetching faqs", error);
      }
    };

    fetchFaqs();
  }, []);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="relative overflow-hidden bg-[var(--mc-bg-main)] pb-20 pt-8 md:bg-[#f8fbfc]">
      <div className="container-custom relative z-10 mx-auto max-w-4xl">
        <div className="mb-8 text-center md:mb-10">
          <span className="inline-flex rounded-full border border-[var(--mc-border)] bg-[var(--mc-bg-card)] px-4 py-2 text-sm font-semibold text-[#2d7084] md:border-[#d6ece6] md:bg-white">
            FAQs
          </span>

          <h2 className="mt-4 text-[30px] font-bold leading-tight text-[var(--mc-text-main)] md:text-5xl md:text-slate-900">
            Frequently Asked Questions
          </h2>

          <p className="mt-3 text-base leading-7 text-[var(--mc-text-soft)] md:text-lg md:text-slate-600">
            Everything you need to know about Multiclout
          </p>
        </div>

        {faqs.length === 0 ? (
          <div className="py-10 text-center text-[var(--mc-text-soft)] md:text-slate-500">
            Loading FAQs...
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <motion.div
                  key={faq._id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  onClick={() => toggleFAQ(index)}
                  className={`cursor-pointer overflow-hidden rounded-[24px] border transition-all duration-300 ${
                    isOpen
                      ? "border-l-[3px] border-l-[#2d7084] shadow-[0_12px_35px_rgba(15,23,42,0.05)]"
                      : ""
                  } border-[var(--mc-border)] bg-[var(--mc-bg-card)] md:bg-white ${
                    isOpen
                      ? "md:border-[#2d7084]/25"
                      : "md:border-slate-200 md:hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 p-5 text-[var(--mc-text-main)] md:p-6 md:text-slate-900">
                    <h3 className="text-[17px] font-semibold leading-snug md:text-lg">
                      {faq.question}
                    </h3>

                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
                        isOpen
                          ? "bg-[#2d7084] text-white"
                          : "bg-[var(--mc-chip-bg)] text-[var(--mc-text-soft)] md:bg-slate-100 md:text-slate-600"
                      }`}
                    >
                      {isOpen ? <FiMinus /> : <FiPlus />}
                    </div>
                  </div>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28 }}
                        className="px-5 pb-5 text-sm leading-7 text-[var(--mc-text-soft)] md:px-6 md:pb-6 md:text-base md:leading-relaxed md:text-slate-600"
                      >
                        {faq.answer}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default FAQSection;