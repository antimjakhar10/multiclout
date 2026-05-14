import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { getImageUrl } from "../../utils/videoHelpers";

function FeaturedVideoSlider({ videos = [] }) {
  const featuredVideos = useMemo(() => {
    if (!videos?.length) return [];
    return videos.slice(0, 6);
  }, [videos]);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (featuredVideos.length <= 1) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % featuredVideos.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [featuredVideos]);

  const prevSlide = () => {
    setActiveIndex((prev) =>
      prev === 0 ? featuredVideos.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % featuredVideos.length);
  };

  if (!featuredVideos.length) return null;

  const prevIndex =
    activeIndex === 0 ? featuredVideos.length - 1 : activeIndex - 1;
  const nextIndex = (activeIndex + 1) % featuredVideos.length;

  const prevVideo = featuredVideos[prevIndex];
  const activeVideo = featuredVideos[activeIndex];
  const nextVideo = featuredVideos[nextIndex];

  return (
    <section className="relative">
      <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] px-4 py-4 md:px-6 md:py-5">
        <button
          onClick={prevSlide}
          className="absolute left-3 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/55 text-white backdrop-blur hover:border-[#8fd4cf]/40"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-3 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/55 text-white backdrop-blur hover:border-[#8fd4cf]/40"
        >
          <ChevronRight size={20} />
        </button>

        <div className="flex items-center justify-center gap-5">
          {/* Left Preview */}
          <div className="hidden xl:block w-[170px] shrink-0">
            <Link
              to={`/watch-videos/${prevVideo.slug}`}
              className="block h-[430px] overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] opacity-80 transition hover:opacity-100"
            >
              <img
                src={getImageUrl(prevVideo.thumbnail)}
                alt={prevVideo.title}
                className="h-full w-full object-cover"
              />
            </Link>
          </div>

          {/* Center Active Slide */}
          <Link
            to={`/watch-videos/${activeVideo.slug}`}
            className="relative block h-[430px] w-full max-w-[980px] overflow-hidden rounded-[30px] border border-white/10 bg-[#111111] shadow-[0_24px_60px_rgba(0,0,0,0.35)]"
          >
            <div className="absolute inset-0">
              <img
                src={getImageUrl(activeVideo.thumbnail)}
                alt={activeVideo.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,10,0.92)_0%,rgba(10,10,10,0.76)_38%,rgba(10,10,10,0.28)_68%,rgba(10,10,10,0.08)_100%)]" />
            </div>

            <div className="relative z-10 flex h-full items-center justify-between gap-8 px-8 py-8 md:px-12">
              <div className="max-w-[56%]">
                <div className="mb-4 inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                  {activeVideo.category}
                </div>

                <h2 className="max-w-[560px] text-4xl font-extrabold leading-[1.12] text-white md:text-5xl">
                  {activeVideo.title}
                </h2>

                <p className="mt-5 max-w-[520px] line-clamp-3 text-lg leading-8 text-white/78">
                  {activeVideo.description || "Watch this featured learning video now."}
                </p>

                <div className="mt-8 inline-flex h-14 items-center gap-3 rounded-full bg-white px-8 text-lg font-semibold text-black shadow-lg">
                  <Play size={19} className="fill-black text-black" />
                  Play
                </div>
              </div>

              <div className="hidden h-[315px] w-[235px] shrink-0 overflow-hidden rounded-[26px] border border-white/10 bg-black/20 lg:block">
                <img
                  src={getImageUrl(activeVideo.thumbnail)}
                  alt={activeVideo.title}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </Link>

          {/* Right Preview */}
          <div className="hidden xl:block w-[170px] shrink-0">
            <Link
              to={`/watch-videos/${nextVideo.slug}`}
              className="block h-[430px] overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] opacity-80 transition hover:opacity-100"
            >
              <img
                src={getImageUrl(nextVideo.thumbnail)}
                alt={nextVideo.title}
                className="h-full w-full object-cover"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturedVideoSlider;