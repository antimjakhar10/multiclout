import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiMinus } from "react-icons/fi";
import axios from "axios";

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/faqs`);
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
    <section className="top-theme-bg py-24 relative overflow-hidden">
      <div className="container-custom relative z-10 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Frequently Asked Questions</h2>
          <p className="text-slate-400 text-lg">Everything you need to know about Multiclout</p>
        </div>

        {faqs.length === 0 ? (
          <div className="text-center text-slate-500 py-10">Loading FAQs...</div>
        ) : (
          <div className="flex flex-col gap-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <motion.div 
                  key={faq._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => toggleFAQ(index)}
                  className={`cursor-pointer rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen ? 'bg-[#0f172a] border-teal-500/50' : 'bg-[#0b1120] border-slate-800 hover:border-slate-600'}`}
                >
                  <div className="p-6 flex justify-between items-center text-white">
                    <h3 className="font-semibold text-lg">{faq.question}</h3>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-teal-500 text-white' : 'bg-white/10 text-slate-300'}`}>
                      {isOpen ? <FiMinus /> : <FiPlus />}
                    </div>
                  </div>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-6 pb-6 text-slate-400 text-base leading-relaxed"
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