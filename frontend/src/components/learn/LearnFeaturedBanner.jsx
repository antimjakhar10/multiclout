import { Lock, Play, Sparkles } from "lucide-react";

function LearnFeaturedBanner({ item, getThumb, onWatch, isSubscribed }) {
  if (!item) return null;

  const locked = item?.requiresSubscription && !isSubscribed;
  const image = getThumb(item);

  return (
    <section className="mb-8 overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-[0_10px_40px_rgba(0,0,0,0.28)]">
      <div className="relative min-h-[250px] sm:min-h-[300px]">
        {image ? (
          <img
            src={image}
            alt={item?.title || "Featured"}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-cyan-500/20 via-slate-900 to-slate-950" />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-[#020817]/95 via-[#020817]/72 to-[#020817]/20" />

        <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-7">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-cyan-400/15 px-3 py-1 text-[11px] font-medium text-cyan-300">
              <Sparkles size={12} />
              Featured Learning
            </span>

            <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] text-white/80">
              {item?.category || "Learning"}
            </span>

            {locked ? (
              <span className="rounded-full bg-yellow-500/15 px-3 py-1 text-[11px] text-yellow-300">
                Premium
              </span>
            ) : (
              <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-[11px] text-emerald-300">
                Free Access
              </span>
            )}
          </div>

          <h2 className="max-w-2xl text-2xl font-bold leading-tight text-white sm:text-3xl">
            {item?.title}
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-white/70 line-clamp-3">
            {item?.description ||
              "Master practical skills with sharp, actionable, and creator-focused learning content on Multiclout."}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onWatch(item)}
              className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-[#07111e] transition hover:scale-[1.02]"
            >
              {locked ? <Lock size={16} /> : <Play size={16} fill="currentColor" />}
              {locked ? "Login to Watch" : "Watch Now"}
            </button>

            <div className="flex flex-wrap items-center gap-2 text-xs text-white/60 sm:text-sm">
              <span>{item?.duration || "3 mins"}</span>
              <span>•</span>
              <span>{(item?.views || 0).toLocaleString()} views</span>
              <span>•</span>
              <span>{item?.likes || 0} likes</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LearnFeaturedBanner;