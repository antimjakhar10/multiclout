import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Clock3, PlayCircle } from "lucide-react";
import MobileAppHeader from "../components/videos/MobileAppHeader";
import MobileBottomNav from "../components/videos/MobileBottomNav";
import logo from "../assets/multiclout-logo.png";
import Footer from "../components/Footer";
import { getImageUrl, getFallbackImageUrl } from "../utils/videoHelpers";

const HISTORY_KEY = "multiclout_watch_history";

function HistoryPage() {
  const navigate = useNavigate();

  const historyItems = useMemo(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, []);

  const handleOpen = (item) => {
    if (item?.slug) {
      navigate(`/watch-videos/${item.slug}`);
      return;
    }
    navigate("/watch-videos");
  };

  return (
    <div
      className="min-h-screen pb-24 md:pb-0"
      style={{
        background: "var(--mc-bg-main)",
        color: "var(--mc-text-main)",
      }}
    >
      <MobileAppHeader showSearch={false} />

      <div className="hidden md:block sticky top-0 z-40 border-b border-white/10 bg-black/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-4 sm:px-6 md:px-8">
          <button onClick={() => navigate("/")} className="shrink-0">
            <img
              src={logo}
              alt="Multiclout"
              className="h-9 w-auto object-contain sm:h-10"
            />
          </button>

          <div className="text-sm font-semibold text-white/80">History</div>
        </div>
      </div>

      <div
        className="mx-auto max-w-[1600px] px-3 py-4 sm:px-6 md:px-8"
        style={{ background: "var(--mc-surface-gradient)" }}
      >
        <div className="mb-5 hidden md:block">
          <h1
            className="text-[28px] font-bold"
            style={{ color: "var(--mc-text-main)" }}
          >
            Watch History
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--mc-text-soft)" }}>
            Recently watched videos from your learning journey
          </p>
        </div>

        {historyItems.length > 0 ? (
          <div className="grid gap-3 sm:gap-4">
            {historyItems.map((item) => {
              const image = getImageUrl(
                item?.thumbnail ||
                  item?.image ||
                  item?.poster ||
                  item?.coverImage ||
                  item?.thumbnailUrl ||
                  item?.thumb ||
                  "",
              );

              return (
                <button
                  key={item?._id || item?.slug || item?.title}
                  onClick={() => handleOpen(item)}
                  className="flex items-start gap-3 rounded-[22px] border p-3 text-left transition sm:items-center sm:gap-4"
                  style={{
                    borderColor: "var(--mc-border)",
                    background: "var(--mc-bg-card)",
                  }}
                >
                  <div className="h-[82px] w-[108px] flex-shrink-0 overflow-hidden rounded-2xl sm:h-[82px] sm:w-[118px]">
                    {image ? (
                      <img
                        src={image}
                        alt={item?.title || "History video"}
                        loading="eager"
                        decoding="async"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          const fallback = getFallbackImageUrl(
                            item?.thumbnail ||
                              item?.image ||
                              item?.poster ||
                              item?.coverImage ||
                              item?.thumbnailUrl ||
                              item?.thumb ||
                              "",
                          );

                          if (fallback && e.currentTarget.src !== fallback) {
                            e.currentTarget.src = fallback;
                          }
                        }}
                      />
                    ) : (
                      <div
                        className="h-full w-full"
                        style={{ background: "var(--mc-bg-soft)" }}
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div
                      className="mb-1.5 flex items-center gap-2 text-[11px] sm:text-xs"
                      style={{ color: "var(--mc-text-soft)" }}
                    >
                      <Clock3 size={13} />
                      Watched recently
                    </div>

                    <h3
                      className="line-clamp-2 text-[14px] font-semibold leading-6 sm:text-sm"
                      style={{ color: "var(--mc-text-main)" }}
                    >
                      {item?.title}
                    </h3>

                    <div
                      className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] sm:gap-3 sm:text-xs"
                      style={{ color: "var(--mc-text-soft)" }}
                    >
                      <span>{item?.category || "General"}</span>
                      <span>•</span>
                      <span>{item?.duration || "3 mins"}</span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1">
                        <PlayCircle size={12} />
                        Resume
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div
            className="rounded-[24px] border border-dashed px-4 py-12 text-center"
            style={{
              borderColor: "var(--mc-border)",
              background: "var(--mc-bg-card)",
            }}
          >
            <h2
              className="text-lg font-semibold"
              style={{ color: "var(--mc-text-main)" }}
            >
              No watch history yet
            </h2>
            <p
              className="mt-2 text-sm"
              style={{ color: "var(--mc-text-soft)" }}
            >
              Start watching videos and they will appear here.
            </p>
          </div>
        )}
      </div>

      <div className="hidden md:block">
        <Footer />
      </div>

      <MobileBottomNav />
    </div>
  );
}

export default HistoryPage;
