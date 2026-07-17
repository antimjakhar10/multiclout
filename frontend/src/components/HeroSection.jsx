import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { FaPlay, FaArrowRight } from "react-icons/fa";
import { FiUsers, FiVideo, FiUserCheck, FiTarget } from "react-icons/fi";
import axios from "axios";
import { API } from "../utils/api";
import { getImageUrl } from "../utils/videoHelpers";
import OtpRegistrationForm from "./auth/OtpRegistrationForm";

const getStatIcon = (label) => {
  const l = label.toLowerCase();

  if (l.includes("learn") || l.includes("student") || l.includes("user")) {
    return <FiUsers size={18} />;
  }

  if (
    l.includes("video") ||
    l.includes("course") ||
    l.includes("lesson") ||
    l.includes("tutorial")
  ) {
    return <FiVideo size={18} />;
  }

  if (l.includes("mentor") || l.includes("guru") || l.includes("teacher")) {
    return <FiUserCheck size={18} />;
  }

  return <FiTarget size={18} />;
};

function HeroSection({ mobileWatchScrollTarget = "" }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [heroSettings, setHeroSettings] = useState(null);

  useEffect(() => {
    fetchStats();
    fetchHeroSettings();
  }, []);

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const res = await axios.get(`${API}/stats`);
      setStats(res.data.stats || []);
    } catch (error) {
      console.error("Error fetching hero stats:", error);
      setStats([]);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchHeroSettings = async () => {
    try {
      const res = await axios.get(`${API}/site-settings`);
      if (res.data.success) {
        setHeroSettings(res.data.settings?.heroSection || null);
      }
    } catch (error) {
      console.error("Error fetching hero settings:", error);
      setHeroSettings(null);
    }
  };

  const safeStats = useMemo(() => {
    if (stats?.length > 0) return stats.slice(0, 3);

    return [
      { value: "40 Lakh+", label: "Learners" },
      { value: "10,000+", label: "Videos" },
      { value: "250+", label: "Mentors" },
    ];
  }, [stats]);

  const videoSrc = heroSettings?.heroVideo
    ? getImageUrl(heroSettings.heroVideo, "/videos/hero.mp4")
    : "/videos/hero.mp4";

  return (
    <section className="relative overflow-hidden bg-black text-white">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_26%),linear-gradient(180deg,rgba(0,0,0,0.42)_0%,rgba(0,0,0,0.58)_45%,rgba(7,17,31,0.88)_100%)]" />

      <div className="absolute left-[12%] top-[16%] h-[140px] w-[140px] rounded-full bg-cyan-400/12 blur-3xl sm:h-[180px] sm:w-[180px] lg:h-[280px] lg:w-[280px]" />
      <div className="absolute bottom-[12%] right-[14%] h-[130px] w-[130px] rounded-full bg-emerald-400/12 blur-3xl sm:h-[180px] sm:w-[180px] lg:h-[260px] lg:w-[260px]" />

      <div className="relative z-10 px-4 pb-10 pt-12 sm:px-5 sm:pb-12 sm:pt-16 md:px-6 lg:px-8 lg:pb-14 lg:pt-20">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(380px,0.95fr)] lg:gap-12">
          <div className="text-center lg:text-left">
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.14em] text-cyan-300 backdrop-blur-md sm:px-4 sm:py-2 sm:text-[11px]">
              <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
              <span className="truncate">
                {heroSettings?.badge || "Learn • Build • Grow With Multiclout"}
              </span>
            </div>

            <h1 className="mt-4 text-[25px] leading-[1.18] font-bold sm:text-[28px] md:text-[46px] lg:max-w-[650px] lg:text-[58px] lg:leading-[1.02]">
              {heroSettings?.titleLine1 || "Build Your Future With"}
              <span className="mt-2 block bg-gradient-to-r from-cyan-300 via-sky-200 to-emerald-300 bg-clip-text text-transparent">
                {heroSettings?.titleHighlight || "Smart Business Learning"}
              </span>
            </h1>

            <p className="hidden md:block mx-auto mt-3 max-w-2xl text-[14px] leading-6 text-slate-200 sm:text-[15px] sm:leading-7 md:text-[16px] md:leading-7 lg:mx-0 lg:max-w-[620px]">
              {heroSettings?.description ||
                "Explore powerful business ideas, practical tutorials, and the right direction to grow with more clarity, confidence, and real support."}
            </p>

            <div className="mt-5 flex flex-col items-center gap-2.5 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                to={heroSettings?.primaryButtonLink || "/business-plan"}
                className="inline-flex h-[44px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 px-5 text-[13px] font-semibold text-white shadow-[0_12px_35px_rgba(16,185,129,0.22)] transition duration-300 hover:scale-[1.02] sm:h-[48px] sm:px-6 sm:text-sm"
              >
                {heroSettings?.primaryButtonText ||
                  "Register Now & Start Earning Today"}
                <FaArrowRight className="text-[10px]" />
              </Link>

              <Link
                to={heroSettings?.secondaryButtonLink || "/watch-videos"}
                onClick={(e) => {
                  if (mobileWatchScrollTarget && window.innerWidth < 768) {
                    e.preventDefault();
                    const section = document.getElementById(
                      mobileWatchScrollTarget,
                    );
                    if (section) {
                      section.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }
                  }
                }}
                className="hidden md:inline-flex h-[44px] items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 text-[13px] font-semibold text-white backdrop-blur-md transition duration-300 hover:bg-white/15 sm:h-[48px] sm:px-6 sm:text-sm"
              >
                <FaPlay className="text-[10px]" />
                {heroSettings?.secondaryButtonText || "Watch Videos"}
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute inset-0 rounded-[32px] bg-gradient-to-br from-cyan-500/10 via-white/5 to-emerald-500/10 blur-2xl" />

            <div className="relative z-10">
              <OtpRegistrationForm
                mode="hero"
                compact={true}
                onHeroVerified={(phone) => {
                  sessionStorage.setItem("verifiedRegisterPhone", phone);
                  navigate("/register");
                }}
              />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              {loadingStats
                ? [1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="rounded-[20px] border border-white/10 bg-white/8 px-3 py-4 backdrop-blur-md"
                    >
                      <div className="mx-auto mb-2 h-9 w-9 animate-pulse rounded-full bg-white/10" />
                      <div className="mx-auto h-5 w-14 animate-pulse rounded bg-white/10" />
                      <div className="mx-auto mt-2 h-3 w-16 animate-pulse rounded bg-white/10" />
                    </div>
                  ))
                : safeStats.map((stat, index) => (
                    <div
                      key={stat._id || index}
                      className="rounded-[20px] border border-white/10 bg-white/8 px-3 py-4 text-center backdrop-blur-md transition duration-300 hover:bg-white/12"
                    >
                      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 text-cyan-300">
                        {getStatIcon(stat.label)}
                      </div>
                      <h3 className="text-[16px] font-bold text-white sm:text-[18px] md:text-[22px]">
                        {stat.value}
                      </h3>
                      <p className="mt-1 text-[11px] leading-4 text-slate-300 capitalize sm:text-xs md:text-sm">
                        {stat.label}
                      </p>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-20 w-full bg-gradient-to-t from-[#07111f] to-transparent sm:h-24" />
    </section>
  );
}

export default HeroSection;
