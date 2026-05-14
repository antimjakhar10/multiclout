import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import VideoCard from "./VideoCard";
import TopRankVideoCard from "./TopRankVideoCard";
import useIsMobileView from "../../hooks/useIsMobileView";

function VideoRowSection({
  title,
  slug,
  videos = [],
  showRanking = false,
  onVideoOpen,
}) {
  const rowRef = useRef(null);
  const isInteractingRef = useRef(false);
const resumeTimerRef = useRef(null);
  const isMobile = useIsMobileView();

  const scrollRow = (direction) => {
    if (!rowRef.current) return;
    rowRef.current.scrollBy({
      left: direction === "left" ? -900 : 900,
      behavior: "smooth",
    });
  };

  const handleCardClick = (video) => {
    if (typeof onVideoOpen === "function") {
      onVideoOpen(video);
    }
  };

useEffect(() => {
  if (!showRanking || videos.length <= 2) return;

  const row = rowRef.current;
  if (!row) return;

  let frameId;
  let lastTime = performance.now();

  const pauseAuto = () => {
    isInteractingRef.current = true;

    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
    }

    resumeTimerRef.current = setTimeout(() => {
      isInteractingRef.current = false;
      lastTime = performance.now();
    }, 1500);
  };

  const move = (time) => {
    const maxScroll = row.scrollWidth - row.clientWidth;

    if (!isInteractingRef.current && maxScroll > 0) {
      const delta = time - lastTime;
      const speed = 0.025; 

      row.scrollLeft += delta * speed;

      if (row.scrollLeft >= maxScroll - 2) {
        row.scrollLeft = 0;
      }
    }

    lastTime = time;
    frameId = requestAnimationFrame(move);
  };

  row.addEventListener("wheel", pauseAuto, { passive: true });
  row.addEventListener("touchstart", pauseAuto, { passive: true });
  row.addEventListener("pointerdown", pauseAuto);

  frameId = requestAnimationFrame(move);

  return () => {
    cancelAnimationFrame(frameId);

    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
    }

    row.removeEventListener("wheel", pauseAuto);
    row.removeEventListener("touchstart", pauseAuto);
    row.removeEventListener("pointerdown", pauseAuto);
  };
}, [showRanking, videos.length]);

if (!videos.length) return null;

  return (
    <section className="relative">
      <div className="mb-3 flex items-center justify-between md:mb-5">
        <h2
          className="text-[20px] font-bold tracking-tight sm:text-[24px] md:text-[42px]"
          style={{
            color: isMobile ? "var(--mc-text-main)" : "#ffffff",
          }}
        >
          {title}
        </h2>

        {slug ? (
          <Link
            to={`/watch-videos/category/${slug}`}
            className="text-[13px] font-semibold transition hover:opacity-80 sm:text-sm md:text-lg"
            style={{
              color: isMobile ? "var(--mc-text-soft)" : "#ffffff",
            }}
          >
            View All
          </Link>
        ) : (
          <span />
        )}
      </div>

      <button
        onClick={() => scrollRow("left")}
        className={`absolute left-[-6px] z-30 hidden -translate-y-1/2 items-center justify-center rounded-full border backdrop-blur md:flex ${
          showRanking ? "top-[45%] h-10 w-10" : "top-[48%] h-10 w-10"
        }`}
        style={{
          borderColor: isMobile ? "var(--mc-border)" : "rgba(255,255,255,0.16)",
          background: isMobile ? "var(--mc-bg-soft)" : "rgba(255,255,255,0.96)",
          color: isMobile ? "var(--mc-text-main)" : "#07111a",
        }}
      >
        <ChevronLeft size={18} />
      </button>

      <div
        ref={rowRef}
        className={`scrollbar-none flex overflow-x-auto pr-2 ${
          showRanking
            ? "items-stretch gap-2.5 pl-1 min-h-[215px] sm:gap-4 sm:min-h-[260px] md:gap-6 md:min-h-[360px]"
            : "items-start gap-2.5 pl-0.5 sm:gap-4 md:gap-5"
        }`}
      >
        {videos.map((video, index) =>
          showRanking ? (
            <div
              key={video._id}
              onClick={() => handleCardClick(video)}
              className="contents"
            >
              <TopRankVideoCard video={video} rankNumber={index + 1} />
            </div>
          ) : (
            <div
              key={video._id}
              onClick={() => handleCardClick(video)}
              className="contents"
            >
              <VideoCard video={video} />
            </div>
          )
        )}
      </div>

      <button
        onClick={() => scrollRow("right")}
        className={`absolute right-[-6px] z-30 hidden -translate-y-1/2 items-center justify-center rounded-full border backdrop-blur md:flex ${
          showRanking ? "top-[45%] h-10 w-10" : "top-[48%] h-10 w-10"
        }`}
        style={{
          borderColor: isMobile ? "var(--mc-border)" : "rgba(255,255,255,0.16)",
          background: isMobile ? "var(--mc-bg-soft)" : "rgba(255,255,255,0.96)",
          color: isMobile ? "var(--mc-text-main)" : "#07111a",
        }}
      >
        <ChevronRight size={18} />
      </button>
    </section>
  );
}

export default VideoRowSection;