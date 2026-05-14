import { ChevronRight, Lock, PlayCircle } from "lucide-react";

function LearnVideoRow({
  title,
  items,
  getThumb,
  onOpen,
  isSubscribed,
  loading,
  showRank = false,
  onViewAll,
}) {
  const hasItems = items?.length > 0;

  return (
    <section className="mb-9">
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
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-[225px] min-w-[275px] animate-pulse rounded-[24px] bg-white/5"
            />
          ))
        ) : hasItems ? (
          items.map((item, index) => {
            const locked = item?.requiresSubscription && !isSubscribed;
            const image = getThumb(item);

            return (
              <button
                key={item?._id || item?.slug || item?.title}
                onClick={() => onOpen(item)}
                className="group min-w-[275px] max-w-[275px] overflow-hidden rounded-[24px] border border-white/10 bg-white/5 text-left shadow-[0_8px_30px_rgba(0,0,0,0.22)] transition hover:bg-white/[0.07]"
              >
                <div className="relative">
                  {image ? (
                    <img
                      src={image}
                      alt={item?.title || "Video"}
                      className="h-[155px] w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="h-[155px] w-full bg-gradient-to-br from-slate-800 to-slate-950" />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

                  {showRank && (
                    <div className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400 text-sm font-bold text-[#07111d] shadow-lg">
                      {index + 1}
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[11px] text-white backdrop-blur-sm">
                    <PlayCircle size={12} />
                    {item?.duration || "3 mins"}
                  </div>
                </div>

                <div className="p-4">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="max-w-[58%] truncate rounded-full bg-white/8 px-2.5 py-1 text-[11px] text-white/80">
                      {item?.category || "Video"}
                    </span>

                    {locked ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/20 px-2.5 py-1 text-[11px] text-yellow-300">
                        <Lock size={12} />
                        Premium
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-1 text-[11px] text-emerald-300">
                        <PlayCircle size={12} />
                        Free
                      </span>
                    )}
                  </div>

                  <h3 className="line-clamp-2 text-[15px] font-semibold leading-6 text-white">
                    {item?.title}
                  </h3>

                  <div className="mt-3 flex items-center justify-between text-xs text-white/55">
                    <span>{(item?.views || 0).toLocaleString()} views</span>
                    <span>{item?.createdAt ? "New" : "Popular"}</span>
                  </div>
                </div>
              </button>
            );
          })
        ) : (
          <div className="w-full rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-8 text-center text-sm text-white/55">
            No videos found for this section yet.
          </div>
        )}
      </div>
    </section>
  );
}

export default LearnVideoRow;