import { ChevronRight, Eye, Heart, Lock, Play } from "lucide-react";

function LearnReelsRow({
  title,
  items,
  getThumb,
  onOpen,
  isSubscribed,
  loading,
  onViewAll,
}) {
  const hasItems = items?.length > 0;

  return (
    <section className="mb-8">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="text-[22px] font-semibold leading-tight text-white">
            {title}
          </h2>
          
        </div>

        <button
          onClick={onViewAll}
          className="mt-1 inline-flex flex-shrink-0 items-center gap-1 whitespace-nowrap text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
        >
          View All
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-[270px] min-w-[165px] animate-pulse rounded-[24px] bg-white/5"
            />
          ))
        ) : hasItems ? (
          items.map((item) => {
            const locked = item?.requiresSubscription && !isSubscribed;
            const image = getThumb(item);

            return (
              <button
                key={item?._id || item?.slug || item?.title}
                onClick={() => onOpen(item)}
                className="group relative min-w-[165px] max-w-[165px] overflow-hidden rounded-[24px] border border-white/10 bg-white/5 text-left shadow-[0_8px_30px_rgba(0,0,0,0.24)]"
              >
                {image ? (
                  <img
                    src={image}
                    alt={item?.title || "Reel"}
                    className="h-[270px] w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-[270px] w-full bg-gradient-to-b from-slate-800 to-slate-950" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />

                <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white backdrop-blur-md">
                  <Play size={14} fill="currentColor" />
                </div>

                <div className="absolute inset-x-0 bottom-0 p-3">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="max-w-[70%] truncate rounded-full bg-black/45 px-2.5 py-1 text-[10px] text-white/85">
                      {item?.category || "Reel"}
                    </span>

                    {locked && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/20 px-2 py-1 text-[10px] text-yellow-300">
                        <Lock size={10} />
                        Locked
                      </span>
                    )}
                  </div>

                  <p className="line-clamp-2 text-sm font-semibold leading-5 text-white">
                    {item?.title}
                  </p>

                  <div className="mt-3 flex items-center gap-3 text-[11px] text-white/70">
                    <span className="inline-flex items-center gap-1">
                      <Eye size={12} />
                      {item?.views || 0}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Heart size={12} />
                      {item?.likes || 0}
                    </span>
                  </div>
                </div>
              </button>
            );
          })
        ) : (
          <div className="w-full rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-8 text-center text-sm text-white/55">
            No reels found for this category yet.
          </div>
        )}
      </div>
    </section>
  );
}

export default LearnReelsRow;