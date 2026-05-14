import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { AiOutlineEye, AiOutlineHeart, AiOutlineShareAlt } from "react-icons/ai";
import { getImageUrl, getFallbackImageUrl } from "../../utils/videoHelpers";
import { formatSocialCount } from "../../utils/formatCount";

function RecommendedVideoCard({ video }) {
  return (
    <Link
  to={video?.slug ? `/watch-videos/${video.slug}` : "#"}
  className="group block min-w-0"
>
      <div
        className="overflow-hidden rounded-[16px] border transition duration-300 group-hover:-translate-y-1"
        style={{
          borderColor: "var(--mc-border)",
          background: "var(--mc-bg-card)",
        }}
      >
        <div className="relative h-[240px] sm:h-[280px] md:h-[320px] overflow-hidden bg-[#0d1118]">
          <img
            src={getImageUrl(video.thumbnail)}
            alt={video.title}
            onError={(e) => {
  const fallback = getFallbackImageUrl(video.thumbnail);
  if (fallback && e.currentTarget.src !== fallback) {
    e.currentTarget.src = fallback;
  }
}}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-2.5">
            <div className="flex items-center justify-between text-[11px] font-semibold text-white">
              <span className="flex items-center gap-1">
                <AiOutlineEye size={14} />
                {formatSocialCount(video.views)}
              </span>

              <span className="flex items-center gap-1">
                <AiOutlineHeart size={14} />
                {formatSocialCount(video.likes)}
              </span>

              <span className="flex items-center gap-1">
                <AiOutlineShareAlt size={14} />
                {formatSocialCount(video.shares)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-2">
  <h3 className="line-clamp-2 min-h-[38px] text-[15px] font-semibold leading-[1.3] text-[var(--mc-text-main)] md:text-[14px] md:text-white">
  {video.title}
</h3>

<div className="mt-1 flex items-center gap-2 text-[13px] text-[var(--mc-text-soft)] md:text-[12px] md:text-white/70">
          <span>{video.duration || "2 mins"}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            {Number(video.rating || 4.5).toFixed(1)}
            <Star size={12} className="fill-yellow-400 text-yellow-400" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default RecommendedVideoCard;