import { Link } from "react-router-dom";
import { Star, Lock } from "lucide-react";
import {
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineShareAlt,
} from "react-icons/ai";
import { getImageUrl, getFallbackImageUrl } from "../../utils/videoHelpers";
import { formatSocialCount } from "../../utils/formatCount";

function VideoCard({ video }) {
  const locked = video?.isLocked || video?.accessType === "subscriber";

  return (
    <Link
      to={video?.slug ? `/watch-videos/${video.slug}` : "#"}
      className="group block min-w-[150px] max-w-[150px] flex-shrink-0 sm:min-w-[155px] sm:max-w-[155px] md:min-w-[240px] md:max-w-[240px]"
    >
      <div className="relative overflow-hidden rounded-[18px] border border-white/10 bg-white/[0.03] transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[#4d9a97]/50 group-hover:shadow-[0_18px_40px_rgba(0,0,0,0.28)] md:rounded-[24px] md:group-hover:-translate-y-1.5">
        <div className="relative aspect-[3/5] overflow-hidden bg-[#0d1118]">
          <img
  src={getImageUrl(video.thumbnail)}
  alt={video.title}
  onError={(e) => {
    const fallback = getFallbackImageUrl(video.thumbnail);
    if (fallback && e.currentTarget.src !== fallback) {
      e.currentTarget.src = fallback;
    }
  }}
  className={`h-full w-full object-contain bg-black transition duration-500 group-hover:scale-105 ${
    locked ? "blur-[1.5px]" : ""
  }`}
/>

          <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/38 to-black/08" />

          {/* Top badges */}
          <div className="absolute left-2 right-2 top-2 z-20 flex items-center justify-between md:left-3 md:right-3 md:top-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 text-[9px] font-semibold text-white backdrop-blur-sm sm:text-[10px] md:px-2.5 md:text-[11px]">
              <Star
                size={11}
                className="fill-yellow-400 text-yellow-400 md:size-[13px]"
              />
              {Number(video.rating || 4.5).toFixed(1)}
            </span>

            <div className="flex items-center gap-1.5">
              {locked && (
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-yellow-400/25 bg-black/65 text-yellow-300 backdrop-blur-md md:h-8 md:w-8">
                  <Lock size={12} className="md:size-[13px]" />
                </span>
              )}

            </div>
          </div>

          {/* Right side stats */}
          <div className="absolute bottom-3 right-2 z-20 flex flex-col items-center gap-3 md:bottom-4 md:right-3 md:gap-4">

  <div className="flex flex-col items-center gap-1">
    <AiOutlineEye size={16} className="text-white/80 md:text-[18px]" />
    <span className="text-[9px] font-semibold text-white md:text-[11px]">
      {formatSocialCount(video.views)}
    </span>
  </div>

  <div className="flex flex-col items-center gap-1">
    <AiOutlineHeart size={16} className="text-white/80 md:text-[18px]" />
    <span className="text-[9px] font-semibold text-white md:text-[11px]">
      {formatSocialCount(video.likes)}
    </span>
  </div>

  <div className="flex flex-col items-center gap-1">
    <AiOutlineShareAlt size={16} className="text-white/80 md:text-[18px]" />
    <span className="text-[9px] font-semibold text-white md:text-[11px]">
      {formatSocialCount(video.shares)}
    </span>
  </div>

</div>

          {/* Bottom content */}
          <div className="absolute inset-x-0 bottom-0 z-20 p-2.5 sm:p-3 md:p-4">
            <h3 className="line-clamp-2 max-w-[70%] text-[12px] font-semibold leading-[1.28] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)] sm:text-[13px] md:max-w-[84%] md:text-[17px] md:leading-[1.32]">
              {video.title}
            </h3>

            <p className="mt-1 text-[10px] font-medium text-white/75 sm:text-[11px] md:mt-1.5 md:text-[13px]">
              {video.duration || "5 mins"}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default VideoCard;