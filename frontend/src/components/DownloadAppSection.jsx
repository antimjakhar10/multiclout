import { motion } from "framer-motion";
import { FiSmartphone } from "react-icons/fi";

function DownloadAppSection() {
  return (
    <section className="bg-white pt-5 pb-20 px-4 relative flex justify-center overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#7bc0b0]/10 blur-[150px] rounded-full"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="w-full max-w-6xl rounded-[36px] bg-gradient-to-r from-[#0f172a] to-[#123040] border border-white/10 p-8 md:p-14 relative overflow-hidden shadow-[0_22px_70px_rgba(15,23,42,0.25)]"
      >
        <div className="absolute top-[-100px] right-[-100px] w-64 h-64 bg-white/10 blur-[50px] rounded-full"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="text-center md:text-left text-white md:w-3/5">
            <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-[#c8fff2]">
              Learn Anywhere
            </span>

            <h2 className="mt-5 text-4xl md:text-5xl font-extrabold mb-5 leading-tight">
              Learning is now in your pocket!
            </h2>

            <p className="text-lg md:text-xl text-white/85 mb-8 font-medium max-w-2xl">
              Download the Multiclout app to watch classes, take quizzes, and
              keep learning on the go.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                className="bg-black hover:bg-slate-900 text-white rounded-2xl px-6 py-4 flex items-center justify-center transition-transform hover:-translate-y-1 shadow-2xl"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Google Play"
                  className="h-8"
                />
              </a>
            </div>

            <p className="mt-5 text-sm text-white/70">
              Fast access • Learning • Easy mobile experience
            </p>
          </div>

          <div className="hidden md:flex justify-center md:w-2/5">
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="relative w-64 h-80 rounded-[40px] border border-white/15 bg-white/10 backdrop-blur-sm shadow-2xl flex items-center justify-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <FiSmartphone className="text-white/25 w-32 h-32 absolute" />
              <div className="absolute bottom-6 w-full text-center">
                <div className="w-16 h-1 mx-auto bg-white/50 rounded-full mb-4"></div>
                <p className="text-white font-bold tracking-widest uppercase text-sm">
                  Multiclout
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default DownloadAppSection;
