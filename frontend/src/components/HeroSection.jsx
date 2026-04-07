import { useState } from "react";
import { motion } from "framer-motion";
import { FiPhone, FiChevronDown, FiShield, FiPlayCircle, FiStar } from "react-icons/fi";

function HeroSection() {
  const [phone, setPhone] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (phone.trim().length !== 10) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }
    alert("OTP sent to " + phone);
  };

  return (
    <section className="relative w-full overflow-hidden top-theme-bg min-h-[85vh] flex items-center justify-center pt-28 lg:pt-16 pb-16">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-white/10 blur-[120px] rounded-full mix-blend-overlay"></div>
        <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-black/20 blur-[120px] rounded-full mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] mix-blend-overlay opacity-30"></div>
      </div>

      <div className="px-6 md:px-12 lg:px-20 relative z-10 w-full max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Content Area */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col text-white w-full max-w-[40rem] mx-auto lg:mx-0 text-center lg:text-left"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 w-fit mx-auto lg:mx-0 mb-6 shadow-xl"
            >
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-sm font-medium tracking-wide">Join 10+ Crore Learners</span>
            </motion.div>

            <h1 className="text-4xl md:text-[3.25rem] lg:text-[4rem] font-extrabold leading-[1.15] mb-6 drop-shadow-lg tracking-tight">
              Crack your goal with <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-amber-400">India's top educators</span>
            </h1>

            <p className="text-lg md:text-xl text-white/90 mb-10 max-w-xl mx-auto lg:mx-0 font-medium">
              Over <span className="font-bold text-yellow-300">10 crore</span> learners trust us for their preparation. Start learning today with premium resources.
            </p>

            {/* Input Form Module */}
            <motion.form 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onSubmit={handleSubmit}
              className="bg-white/10 backdrop-blur-xl border border-white/20 p-2 md:p-3 rounded-2xl w-full max-w-xl mx-auto lg:mx-0 shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex bg-white rounded-xl overflow-hidden h-14 md:h-16 flex-1 shadow-inner items-center px-4">
                  <div className="flex items-center gap-2 text-slate-700 font-semibold border-r border-slate-200 pr-3 cursor-pointer hover:bg-slate-50 transition-colors py-2 rounded-lg">
                    <span className="text-xl">🇮🇳</span>
                    <span>+91</span>
                    <FiChevronDown className="text-slate-400" />
                  </div>
                  <input
                    type="tel"
                    placeholder="Enter mobile number"
                    className="w-full h-full bg-transparent outline-none px-4 text-slate-800 font-semibold placeholder:text-slate-400"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    maxLength="10"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-black text-white font-semibold rounded-xl h-14 md:h-16 px-8 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg flex-shrink-0 flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  Join for free
                </button>
              </div>
              <div className="w-full mt-3 flex items-center justify-center md:justify-start gap-2 pl-2 md:pl-4 opacity-80 text-sm">
                <FiShield /> <span>We'll send an OTP for verification</span>
              </div>
            </motion.form>
          </motion.div>

          {/* Right Illustrations Area */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative lg:h-[650px] flex items-center justify-center mt-12 lg:mt-0"
          >
            {/* Main Interactive Floating Display */}
            <div className="relative w-full max-w-lg lg:max-w-xl mx-auto aspect-square">
              {/* Central Glowing Orb */}
              <div className="absolute inset-0 bg-white/20 blur-[80px] rounded-full animate-pulse shadow-[0_0_120px_rgba(255,255,255,0.4)]"></div>
              
              {/* Main Image Banner */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute z-20 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] rounded-[2rem] overflow-hidden border-4 border-white/20 shadow-2xl backdrop-blur-md"
              >
                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop" alt="Students leaning online" className="w-full h-auto object-cover opacity-90 hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="font-bold text-lg flex items-center gap-2"><FiPlayCircle className="text-green-400" /> Live Interactive Classes</p>
                </div>
              </motion.div>

              {/* Floating Element 1 - Reviews */}
              <motion.div 
                animate={{ y: [0, -15, 0], rotate: [0, 2, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                className="absolute top-[10%] right-[-5%] z-30 bg-white text-slate-800 rounded-2xl p-4 shadow-2xl flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-yellow-100 text-yellow-500 rounded-full flex items-center justify-center text-xl">
                  <FiStar className="fill-current" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Top Rated</p>
                  <p className="font-extrabold text-xl">4.9/5.0</p>
                </div>
              </motion.div>

              {/* Floating Element 2 - Tutors */}
              <motion.div 
                animate={{ y: [0, 20, 0], rotate: [0, -2, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 0.5 }}
                className="absolute bottom-[10%] left-[-5%] z-30 bg-[#0f172a]/90 backdrop-blur-lg border border-white/10 text-white rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-4"
              >
                <div className="flex -space-x-3">
                  <img className="w-10 h-10 rounded-full border-2 border-[#0f172a]" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" alt="Tutor" />
                  <img className="w-10 h-10 rounded-full border-2 border-[#0f172a]" src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=150&auto=format&fit=crop" alt="Tutor" />
                  <div className="w-10 h-10 rounded-full border-2 border-[#0f172a] bg-slate-700 flex items-center justify-center text-xs font-bold">+50</div>
                </div>
                <div>
                  <p className="font-bold text-sm">Expert Mentors</p>
                  <p className="text-xs text-slate-300">Available 24/7</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

export default HeroSection;