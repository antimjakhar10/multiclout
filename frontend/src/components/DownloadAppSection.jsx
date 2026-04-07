import { motion } from "framer-motion";
import { FiSmartphone } from "react-icons/fi";

function DownloadAppSection() {
  return (
    <section className="top-theme-bg py-24 px-4 relative flex justify-center overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-500/10 blur-[150px] rounded-full"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="w-full max-w-5xl rounded-[40px] bg-white/10 backdrop-blur-xl border border-white/20 p-10 md:p-16 relative overflow-hidden shadow-2xl"
      >
        <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] mix-blend-overlay opacity-30"></div>
        <div className="absolute top-[-100px] right-[-100px] w-64 h-64 bg-white/20 blur-[50px] rounded-full"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="text-center md:text-left text-white md:w-3/5">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              Learning is now in your pocket!
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-8 font-medium">
              Download the Multiclout app to watch classes offline, take quizzes, and learn on the go.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button className="bg-black hover:bg-slate-900 text-white rounded-xl px-6 py-4 flex items-center justify-center gap-4 transition-transform hover:-translate-y-1 shadow-2xl">
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-8" />
              </button>
              <button className="bg-black hover:bg-slate-900 text-white rounded-xl px-6 py-4 flex items-center justify-center gap-4 transition-transform hover:-translate-y-1 shadow-2xl">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-8" />
              </button>
            </div>
          </div>
          
          <div className="hidden md:flex justify-center md:w-2/5">
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="relative w-64 h-80 rounded-[40px] border-8 border-white/20 bg-black/40 backdrop-blur-sm shadow-2xl flex items-center justify-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <FiSmartphone className="text-white/30 w-32 h-32 absolute center" />
              <div className="absolute bottom-6 w-full text-center">
                <div className="w-16 h-1 mx-auto bg-white/50 rounded-full mb-4"></div>
                <p className="text-white font-bold tracking-widest uppercase text-sm">Multiclout</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default DownloadAppSection;