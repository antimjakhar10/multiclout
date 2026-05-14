import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { getImageUrl, getFallbackImageUrl } from "../../utils/videoHelpers";

function TopRankVideoCard({ video, rankNumber }) {
  const locked = video?.isLocked || video?.accessType === "subscriber";

  return (
    <Link
      to={video?.slug ? `/watch-videos/${video.slug}` : "#"}
      className="group relative block h-[220px] min-w-[170px] max-w-[170px] flex-shrink-0 overflow-hidden sm:h-[260px] sm:min-w-[200px] sm:max-w-[200px] md:h-[380px] md:min-w-[320px] md:max-w-[320px]"
    >
      {/* Mobile rank badge - untouched */}
      <div className="absolute left-2 top-2 z-30 md:hidden">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black/65 text-sm font-bold text-white shadow-[0_8px_20px_rgba(0,0,0,0.28)] backdrop-blur">
          {rankNumber}
        </div>
      </div>

      {/* Desktop background rank number */}
     <div className="pointer-events-none absolute bottom-6 left-7 z-10 hidden select-none md:block">
        <span className="block text-[140px] font-semibold leading-none text-white/22 [-webkit-text-stroke:1px_rgba(255,255,255,0.18)]">
          {rankNumber}
        </span>
      </div>

      <div className="absolute left-[40px] top-3 h-[160px] w-[130px] rounded-[20px] bg-[#4d9a97]/20 blur-xl opacity-0 transition duration-300 group-hover:opacity-100 sm:left-[55px] sm:h-[200px] sm:w-[160px] md:left-[88px] md:top-7 md:h-[290px] md:w-[225px] md:rounded-[30px] md:blur-2xl" />

      <div
        className="relative z-20 ml-[12px] h-[190px] w-[145px] overflow-hidden rounded-[18px] border transition duration-300 group-hover:-translate-y-1 group-hover:scale-[1.02] group-hover:border-[#4d9a97]/60 group-hover:shadow-[0_18px_40px_rgba(77,154,151,0.18)] sm:ml-[16px] sm:h-[220px] sm:w-[170px] sm:rounded-[20px] md:ml-[82px] md:h-[330px] md:w-[250px] md:rounded-[26px]"
        style={{
          borderColor: "var(--mc-border)",
          background: "var(--mc-bg-card)",
        }}
      >
        <div className="relative h-full w-full overflow-hidden bg-[#0d1118]">
          <img
            src={getImageUrl(video.thumbnail)}
            alt={video.title}
            onError={(e) => {
  const fallback = getFallbackImageUrl(video.thumbnail);
  if (fallback && e.currentTarget.src !== fallback) {
    e.currentTarget.src = fallback;
  }
}}
            className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${
              locked ? "blur-[1.5px]" : ""
            }`}
          />

          {locked && (
            <div className="absolute right-2 top-2 z-30 md:right-3 md:top-3">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-yellow-400/25 bg-black/70 text-yellow-300 backdrop-blur-md md:h-9 md:w-9">
                <Lock size={13} />
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default TopRankVideoCard;