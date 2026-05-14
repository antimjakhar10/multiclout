import { useEffect, useMemo, useState } from "react";
import {
  ChevronRight,
  Play,
  Sparkles,
  BookOpen,
  MonitorPlay,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MobileBottomNav from "../components/videos/MobileBottomNav";
import { API } from "../utils/videoHelpers";

function Tutorials() {
  const [tutorials, setTutorials] = useState([]);
  const [selectedTutorial, setSelectedTutorial] = useState(null);
  const [loading, setLoading] = useState(true);

  const pageBanner = useMemo(
    () =>
      "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1600&auto=format&fit=crop",
    [],
  );

  const fetchTutorials = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/tutorials`);
      const data = await res.json();

      if (data.success) {
        const list = data.tutorials || [];
        setTutorials(list);
        setSelectedTutorial(list[0] || null);
      }
    } catch (error) {
      console.error("Tutorials fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTutorials();
  }, []);

  const activeEmbedUrl = selectedTutorial?.embedUrl || "";
  const activeWatchUrl = selectedTutorial?.videoUrl || "";

  return (
    <div
      className="min-h-screen pb-20 md:pb-0"
      style={{
        background: "var(--mc-bg-main)",
        color: "var(--mc-text-main)",
      }}
    >
      <Navbar />

      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${pageBanner})` }}
        />

        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,17,26,0.72),rgba(7,17,26,0.45),rgba(7,17,26,0.28))]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,17,26,0.20),rgba(7,17,26,0.08),rgba(7,17,26,0.24))]" />

        <div className="relative mx-auto max-w-[1440px] px-5 py-14 md:px-8 md:py-16">
          <div className="mx-auto flex max-w-3xl flex-col items-center px-2 text-center sm:px-0">
            <div className="mb-4 flex items-center justify-center gap-2 text-sm text-white/75">
              <span>Home</span>
              <ChevronRight size={16} />
              <span className="text-[#41d7c6]">Tutorials</span>
            </div>

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#41d7c6]">
              <Sparkles size={14} />
              Learn Faster
            </div>

            <h1 className="text-[30px] font-bold leading-[1.2] tracking-tight text-white sm:text-4xl md:text-5xl">
              Learn with{" "}
              <span className="text-[#41d7c6]">Professional Tutorials</span>
            </h1>

            <p className="mx-auto mt-4 max-w-[95%] text-[14px] leading-6 text-white/80 sm:max-w-2xl md:text-base">
              Learn step by step with clear business tutorials. Select any topic
              from the list and watch it instantly.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/85">
                <BookOpen size={16} className="text-[#41d7c6]" />
                Structured learning
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/85">
                <MonitorPlay size={16} className="text-[#41d7c6]" />
                Instant video access
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="md:bg-white"
        style={{
          background: "var(--mc-bg-main)",
        }}
      >
        <div className="mx-auto max-w-[1440px] px-5 py-10 md:px-8 md:py-14">
          {loading ? (
            <div
              className="rounded-[24px] border p-8 shadow-sm"
              style={{
                background: "var(--mc-bg-card)",
                borderColor: "var(--mc-border)",
                color: "var(--mc-text-soft)",
              }}
            >
              Loading tutorials...
            </div>
          ) : tutorials.length === 0 ? (
            <div
              className="rounded-[24px] border p-8 shadow-sm"
              style={{
                background: "var(--mc-bg-card)",
                borderColor: "var(--mc-border)",
                color: "var(--mc-text-soft)",
              }}
            >
              No tutorials found.
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
              <div
                className="rounded-[24px] p-6"
                style={{
                  background: "var(--mc-bg-card)",
                  border: "1px solid var(--mc-border)",
                }}
              >
                <h2 className="mb-6 text-[28px] font-bold text-[#0b5c8e] md:text-[34px]">
                  Video Tutorials
                </h2>

                <div>
                  {tutorials.map((item, index) => {
                    const isActive = selectedTutorial?._id === item._id;

                    return (
                      <button
                        key={item._id || index}
                        onClick={() => setSelectedTutorial(item)}
                        className="block w-full border-b px-0 py-5 text-left transition"
                        style={{
                          borderColor: "var(--mc-border)",
                          color: isActive ? "#41d7c6" : "var(--mc-text-main)",
                        }}
                      >
                        <span className="text-[16px] leading-8 md:text-[17px]">
                          {item.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div
                className="overflow-hidden rounded-[20px] shadow-sm"
                style={{
                  background: "var(--mc-bg-card)",
                  border: "1px solid var(--mc-border)",
                }}
              >
                <div className="aspect-video w-full bg-black">
                  {activeEmbedUrl ? (
                    <iframe
                      key={selectedTutorial?._id}
                      src={
                        activeEmbedUrl.includes("?")
                          ? `${activeEmbedUrl}&rel=0&modestbranding=1`
                          : `${activeEmbedUrl}?rel=0&modestbranding=1`
                      }
                      title={selectedTutorial?.title || "Tutorial Video"}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center bg-black text-white">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-600 shadow-[0_12px_30px_rgba(220,38,38,0.35)]">
                        <Play
                          size={34}
                          className="ml-1 fill-white text-white"
                        />
                      </div>
                      <p className="mt-4 text-sm text-white/75">
                        Select a tutorial to play video
                      </p>
                    </div>
                  )}
                </div>

                <div className="px-6 py-8 md:bg-white md:px-8 md:py-10">
                  <h2 className="text-[30px] font-bold leading-tight text-[#0b5c8e] md:text-[34px]">
                    {selectedTutorial?.title || "Tutorial"}
                  </h2>

                  {activeWatchUrl ? (
                    <a
                      href={activeWatchUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-block text-[15px] text-sky-500 hover:text-sky-600"
                    >
                      Watch on YouTube
                    </a>
                  ) : null}

                  {selectedTutorial?.description ? (
                    <p
                      className="mt-4 max-w-3xl text-[15px] leading-7"
                      style={{ color: "var(--mc-text-soft)" }}
                    >
                      {selectedTutorial.description}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="hidden md:block">
        <Footer />
      </div>

      <div className="md:hidden">
        <MobileBottomNav />
      </div>
    </div>
  );
}

export default Tutorials;
