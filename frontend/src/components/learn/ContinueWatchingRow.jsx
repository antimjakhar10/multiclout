import { ChevronRight, Clock3, PlayCircle } from "lucide-react";

function ContinueWatchingRow({
  title = "Continue Watching",
  items,
  getThumb,
  onOpen,
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
          <p className="mt-1 text-sm leading-5 text-white/45">
            Pick up where you left off
          </p>
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
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-[205px] min-w-[290px] animate-pulse rounded-[24px] bg-white/5"
            />
          ))
        ) : hasItems ? (
          items.map((item) => {
            const image = getThumb(item);

            return (
              <button
                key={item?._id || item?.slug || item?.title}
                onClick={() => onOpen(item)}
                className="group min-w-[290px] max-w-[290px] overflow-hidden rounded-[24px] border border-white/10 bg-white/5 text-left shadow-[0_8px_30px_rgba(0,0,0,0.22)] transition hover:bg-white/[0.07]"
              >
                <div className="relative">
                  {image ? (
                    <img
                      src={image}
                      alt={item?.title || "Continue Watching"}
                      className="h-[145px] w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="h-[145px] w-full bg-gradient-to-br from-slate-800 to-slate-950" />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

                  <div className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[11px] text-white backdrop-blur-sm">
                    <PlayCircle size={12} />
                    {item?.duration || "3 mins"}
                  </div>
                </div>

                <div className="p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs text-white/55">
                    <Clock3 size={13} />
                    Continue from last session
                  </div>

                  <h3 className="line-clamp-2 text-[15px] font-semibold leading-6 text-white">
                    {item?.title}
                  </h3>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-[42%] rounded-full bg-cyan-400" />
                  </div>
                </div>
              </button>
            );
          })
        ) : (
          <div className="w-full rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-8 text-center text-sm text-white/55">
            No continue watching data yet.
          </div>
        )}
      </div>
    </section>
  );
}

export default ContinueWatchingRow;