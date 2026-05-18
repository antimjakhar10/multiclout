import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft,
  Star,
  Download,
  Share2,
  Search,
  LayoutGrid,
  Eye,
  Heart,
  Lock,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  API,
  getImageUrl,
  getVideoUrl,
  getFallbackVideoUrl,
} from "../utils/videoHelpers";
import { formatSocialCount } from "../utils/formatCount";
import RecommendedVideoCard from "../components/videos/RecommendedVideoCard";
import MobileBottomNav from "../components/videos/MobileBottomNav";
import useIsMobileView from "../hooks/useIsMobileView";
import SEO from "../components/SEO";

const DESKTOP_BG =
  "radial-gradient(circle_at_top,rgba(77,154,151,0.12),transparent_28%),linear-gradient(180deg,#05111d_0%,#000000_35%,#000000_100%)";

function getYoutubeEmbedUrl(url = "") {
  if (!url) return "";

  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtube.com")) {
      const videoId = parsed.searchParams.get("v");
      return videoId
        ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0&playsinline=1`
        : "";
    }

    if (parsed.hostname.includes("youtu.be")) {
      const videoId = parsed.pathname.replace("/", "");
      return videoId
        ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0&playsinline=1`
        : "";
    }

    return "";
  } catch {
    return "";
  }
}

const resolveVideoSrc = (video) => {
  if (!video) return "";

  if (video.videoFile) {
    return getVideoUrl(video.videoFile);
  }

  return video.videoUrl || "";
};

const resolveFallbackVideoSrc = (video) => {
  if (!video?.videoFile) return "";
  return getFallbackVideoUrl(video.videoFile);
};

function isDirectVideo(url = "") {
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
}

function VideoDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobileView();

  const [loading, setLoading] = useState(true);
  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [desktopSearchOpen, setDesktopSearchOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const videoRef = useRef(null);

  useEffect(() => {
    const syncAuth = () => {
      const token =
        localStorage.getItem("userToken") || localStorage.getItem("token");
      setLoggedIn(!!token);
    };

    syncAuth();
    window.addEventListener("storage", syncAuth);
    window.addEventListener("focus", syncAuth);

    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("focus", syncAuth);
    };
  }, []);

  useEffect(() => {
    fetchVideo();
  }, [slug]);

  useEffect(() => {
    const media = videoRef.current;
    if (!media || !video?.canWatch) return;

    const setInitialMutedAutoplay = async () => {
      try {
        media.defaultMuted = true;
        media.muted = true;
        await media.play();
      } catch (error) {
        console.error("Autoplay failed:", error);
      }
    };

    setInitialMutedAutoplay();
  }, [video]);

  useEffect(() => {
    if (!slug) return;

    const likeKey = `multiclout_video_liked_${slug}`;
    setLiked(localStorage.getItem(likeKey) === "true");
  }, [slug]);

  const handleView = async () => {
    if (!slug || !video?.canWatch) return;

    try {
      const res = await fetch(`${API}/videos/${slug}/view`, {
        method: "POST",
      });

      const result = await res.json();

      if (result.success) {
        setVideo((prev) =>
          prev
            ? {
                ...prev,
                views: result.views,
                likes: result.likes,
                shares: result.shares,
              }
            : prev,
        );
      }
    } catch (error) {
      console.error("View increment failed:", error);
    }
  };

  const fetchVideo = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("userToken") || localStorage.getItem("token");

      const res = await fetch(`${API}/videos/${slug}`, {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
      });

      const result = await res.json();

      if (result.success) {
        setVideo(result.video);
        setRelatedVideos(result.relatedVideos || []);
        setShowFullDesc(false);
      } else {
        setVideo(null);
        setRelatedVideos([]);
      }
    } catch (error) {
      console.error("video detail fetch error:", error);
      setVideo(null);
      setRelatedVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!slug || liked) return;

    try {
      const res = await fetch(`${API}/videos/${slug}/like`, {
        method: "POST",
      });
      const result = await res.json();

      if (result.success) {
        setVideo((prev) =>
          prev
            ? {
                ...prev,
                views: result.views,
                likes: result.likes,
                shares: result.shares,
              }
            : prev,
        );
        setLiked(true);
        localStorage.setItem(`multiclout_video_liked_${slug}`, "true");
      }
    } catch (error) {
      console.error("Like increment failed:", error);
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareData = {
      title: video?.title || "Multiclout Video",
      text: video?.description || "Check out this video on Multiclout",
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied successfully");
      }

      const res = await fetch(`${API}/videos/${slug}/share`, {
        method: "POST",
      });
      const result = await res.json();

      if (result.success) {
        setVideo((prev) =>
          prev
            ? {
                ...prev,
                views: result.views,
                likes: result.likes,
                shares: result.shares,
              }
            : prev,
        );
      }
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  const videoFileSrc = useMemo(() => {
    return resolveVideoSrc(video);
  }, [video]);

  const fallbackVideoFileSrc = useMemo(() => {
    return resolveFallbackVideoSrc(video);
  }, [video]);

  const directVideoUrl = useMemo(() => {
    if (!video?.videoUrl) return "";
    return isDirectVideo(video.videoUrl) ? video.videoUrl : "";
  }, [video]);

  const youtubeEmbedUrl = useMemo(() => {
    if (!video?.videoUrl) return "";
    return !directVideoUrl ? getYoutubeEmbedUrl(video.videoUrl) : "";
  }, [video, directVideoUrl]);

  const shortDescription =
    video?.description?.length > 170
      ? `${video.description.slice(0, 170)}...`
      : video?.description || "";

  const viewsCount = video?.views || "0";
  const likesCount = video?.likes || "0";
  const sharesCount = video?.shares || "0";

  const isLocked = !!video?.isLocked;
  const canWatch = !!video?.canWatch;

  const recommendedVideos = useMemo(() => {
    return relatedVideos.slice(0, isMobile ? 4 : 3);
  }, [relatedVideos, isMobile]);

  const renderTopBar = () => (
    <div className="hidden border-b border-white/10 bg-black/95 backdrop-blur-xl md:block">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-4 md:px-8">
        <Link
          to="/watch-videos"
          className="inline-flex h-11 items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-4 text-sm font-semibold !text-white transition hover:border-[#8fd4cf]/40 hover:!text-[#8fd4cf]"
        >
          <ChevronLeft size={18} className="shrink-0" />
          <span className="!text-white">Back</span>
        </Link>

        <div className="flex items-center gap-3">
          {desktopSearchOpen && (
            <div className="relative">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/45"
              />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search videos"
                className="h-11 w-[300px] rounded-full border border-white/10 bg-white/[0.05] pl-11 pr-4 text-sm text-white placeholder:text-white/40 outline-none focus:border-[#4d9a97]/40"
              />
            </div>
          )}

          <button
            type="button"
            onClick={() => setDesktopSearchOpen((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] text-white transition hover:border-[#4d9a97]/40"
          >
            <Search size={18} />
          </button>

          <button
            onClick={() => navigate("/watch-videos/categories")}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-5 text-sm font-semibold text-white transition hover:border-[#4d9a97]/40"
          >
            <LayoutGrid size={18} />
            All Categories
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <>
        <div className="hidden md:block">
          <Navbar />
        </div>
        <div className="md:hidden">
          <Navbar />
        </div>
        {renderTopBar()}

        <div
          className="min-h-screen pb-24 md:pb-0"
          style={{
            background: isMobile ? "var(--mc-bg-main)" : "#000000",
            color: isMobile ? "var(--mc-text-main)" : "#ffffff",
          }}
        >
          <div
            className="mx-auto flex min-h-[80vh] max-w-[1500px] items-center justify-center px-4 md:px-8"
            style={{ color: isMobile ? "var(--mc-text-soft)" : "#ffffffb3" }}
          >
            Loading...
          </div>

          <div className="hidden md:block">
            <Footer />
          </div>

          <div className="md:hidden">
            <MobileBottomNav />
          </div>
        </div>
      </>
    );
  }

  if (!video) {
    return (
      <>
        <div className="hidden md:block">
          <Navbar />
        </div>
        <div className="md:hidden">
          <Navbar />
        </div>
        {renderTopBar()}

        <div
          className="min-h-screen pb-24 md:pb-0"
          style={{
            background: isMobile ? "var(--mc-bg-main)" : "#000000",
            color: isMobile ? "var(--mc-text-main)" : "#ffffff",
          }}
        >
          <div
            className="mx-auto flex min-h-[80vh] max-w-[1500px] items-center justify-center px-4 md:px-8"
            style={{ color: isMobile ? "var(--mc-text-soft)" : "#ffffffb3" }}
          >
            Video not found
          </div>

          <div className="hidden md:block">
            <Footer />
          </div>

          <div className="md:hidden">
            <MobileBottomNav />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title={video?.seoTitle || video?.title || "Educational Video"}
        description={
          video?.seoDescription ||
          video?.description ||
          "Watch educational videos on Multiclout"
        }
        keywords={
          video?.seoKeywords ||
          `${video?.title || ""}, ${video?.category || ""}, Multiclout videos`
        }
      />
      <div className="hidden md:block">
        <Navbar />
      </div>
      <div className="md:hidden">
        <Navbar />
      </div>
      {renderTopBar()}

      <div
        className="min-h-screen pb-24 md:pb-0"
        style={{
          background: isMobile ? "var(--mc-bg-main)" : "#000000",
          color: isMobile ? "var(--mc-text-main)" : "#ffffff",
        }}
      >
        <div
          className="mx-auto max-w-[1280px] px-4 py-5 md:px-8 md:py-7"
          style={{
            background: isMobile ? "var(--mc-surface-gradient)" : DESKTOP_BG,
          }}
        >
          <div className="mb-4 md:hidden">
            <Link
              to="/watch-videos"
              className="inline-flex items-center gap-2 text-[15px] font-semibold transition"
              style={{ color: isMobile ? "var(--mc-text-soft)" : "#ffffffcc" }}
            >
              <ChevronLeft size={18} />
              Back
            </Link>
          </div>

          <div className="grid gap-6 md:items-start md:justify-center xl:grid-cols-[360px_minmax(0,720px)] xl:gap-14">
            <div className="self-start">
              <div
                className="relative mx-auto aspect-[9/16] w-full max-w-[390px] overflow-hidden rounded-[22px] border shadow-[0_18px_45px_rgba(0,0,0,0.32)] md:h-[620px] md:aspect-auto md:max-w-none xl:h-[610px]"
                style={{
                  borderColor: isMobile
                    ? "var(--mc-border)"
                    : "rgba(255,255,255,0.10)",
                  background: isMobile
                    ? "var(--mc-bg-card)"
                    : "rgba(255,255,255,0.03)",
                }}
              >
                <div className="relative h-full">
                  {canWatch ? (
                    videoFileSrc ? (
                      <video
                        ref={videoRef}
                        src={videoFileSrc}
                        controls
                        autoPlay
                        playsInline
                        loop
                        preload="metadata"
                        onPlay={handleView}
                        onError={(e) => {
                          if (
                            fallbackVideoFileSrc &&
                            e.currentTarget.src !== fallbackVideoFileSrc
                          ) {
                            e.currentTarget.src = fallbackVideoFileSrc;
                            e.currentTarget.load();
                          }
                        }}
                        className="h-full w-full bg-black object-cover"
                      />
                    ) : directVideoUrl ? (
                      <video
                        ref={videoRef}
                        src={directVideoUrl}
                        controls
                        autoPlay
                        playsInline
                        loop
                        preload="metadata"
                        onPlay={handleView}
                        className="h-full w-full bg-black object-cover"
                      />
                    ) : youtubeEmbedUrl ? (
                      <iframe
                        src={youtubeEmbedUrl}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="h-full w-full bg-black"
                      />
                    ) : (
                      <img
                        src={getImageUrl(video.thumbnail)}
                        alt={video.title}
                        onError={(e) => {
                          const fallback = getFallbackVideoUrl(video.thumbnail);

                          if (fallback && e.currentTarget.src !== fallback) {
                            e.currentTarget.src = fallback;
                          }
                        }}
                        className="h-full w-full object-cover"
                      />
                    )
                  ) : (
                    <>
                      <img
                        src={getImageUrl(video.thumbnail)}
                        alt={video.title}
                        onError={(e) => {
                          const fallback = getFallbackVideoUrl(video.thumbnail);

                          if (fallback && e.currentTarget.src !== fallback) {
                            e.currentTarget.src = fallback;
                          }
                        }}
                        className="h-full w-full object-cover blur-[2px]"
                      />

                      <div className="absolute inset-0 flex items-center justify-center bg-black/55 p-5">
                        <div className="w-full max-w-[320px] rounded-[24px] border border-white/10 bg-black/65 p-5 text-center backdrop-blur-xl">
                          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-yellow-400/25 bg-yellow-400/10 text-yellow-300">
                            <Lock size={24} />
                          </div>

                          <h3 className="mt-4 text-[22px] font-bold text-white">
                            This video is locked
                          </h3>

                          <p className="mt-3 text-sm leading-7 text-white/70">
                            {video?.lockedReason === "login_required"
                              ? "Is video ko dekhne ke liye pehle login karo."
                              : "Is premium video ko dekhne ke liye active plan chahiye."}
                          </p>

                          <div className="mt-5 flex flex-col gap-3">
                            {!loggedIn ? (
                              <button
                                type="button"
                                onClick={() => navigate("/login")}
                                className="inline-flex h-12 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-5 text-sm font-semibold text-white"
                              >
                                Login to Continue
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() =>
                                  navigate("/account/subscription")
                                }
                                className="inline-flex h-12 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-5 text-sm font-semibold text-white"
                              >
                                Unlock with Subscription
                              </button>
                            )}

                            <button
  type="button"
  onClick={() => navigate("/mobile-subscription")}
  className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] px-5 text-sm font-semibold text-white"
>
  View Plans
</button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="pointer-events-none absolute bottom-16 right-3 z-20 flex flex-col items-center gap-4 md:bottom-10">
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
                      <Eye size={18} className="text-white" />
                    </div>
                    <span className="text-[12px] font-semibold leading-none text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]">
                      {formatSocialCount(viewsCount)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleLike}
                    disabled={liked}
                    className="pointer-events-auto flex flex-col items-center gap-1"
                  >
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition ${
                        liked
                          ? "border-[#ff4d6d]/40 text-[#ff4d6d]"
                          : "hover:border-[#ff4d6d]/40 hover:text-[#ff4d6d]"
                      }`}
                    >
                      <Heart
                        size={18}
                        className={
                          liked ? "fill-[#ff4d6d] text-[#ff4d6d]" : "text-white"
                        }
                      />
                    </div>
                    <span className="text-[12px] font-semibold leading-none text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]">
                      {formatSocialCount(likesCount)}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleShare}
                    className="pointer-events-auto flex flex-col items-center gap-1"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition hover:border-[#8fd4cf]/40 hover:text-[#8fd4cf]">
                      <Share2 size={18} />
                    </div>
                    <span className="text-[12px] font-semibold leading-none text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]">
                      {formatSocialCount(sharesCount)}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex max-w-[720px] flex-col self-start">
              <div>
                <h1
                  className="text-[26px] font-extrabold leading-[1.12] tracking-tight md:text-[31px] md:whitespace-nowrap xl:text-[34px] 2xl:text-[38px]"
                  style={{
                    color: isMobile ? "var(--mc-text-main)" : "#ffffff",
                  }}
                >
                  {video.title}
                </h1>

                <div className="mt-3 inline-flex rounded-full bg-[#1fb655] px-4 py-2 text-sm font-semibold text-white">
                  {video.category}
                </div>

                {isLocked && (
                  <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-4 py-2 text-sm font-semibold text-yellow-300">
                    <Lock size={16} />
                    Premium locked content
                  </div>
                )}

                <div
                  className="mt-3 flex items-center gap-3 text-[16px] md:text-[15px]"
                  style={{
                    color: isMobile ? "var(--mc-text-soft)" : "#ffffffcc",
                  }}
                >
                  <span>{video.duration || "2 mins"}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    {Number(video.rating || 4.5).toFixed(1)}
                    <Star
                      size={16}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  </span>
                </div>

                <div
                  className="mt-3 max-w-[660px] text-[15px] leading-7 md:text-[15px] md:leading-7"
                  style={{
                    color: isMobile ? "var(--mc-text-main)" : "#ffffff",
                  }}
                >
                  <span>
                    {showFullDesc ? video.description : shortDescription}
                  </span>

                  {video.description?.length > 170 && (
                    <button
                      type="button"
                      onClick={() => setShowFullDesc((prev) => !prev)}
                      className="ml-2 font-semibold text-[#c96cff] transition hover:text-[#dd9cff]"
                    >
                      {showFullDesc ? "Read Less" : "Read More"}
                    </button>
                  )}
                </div>

                <a
                  href="https://multiclout.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex h-12 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#b235ff] via-[#8f3dff] to-[#6d39ff] px-6 text-[14px] font-semibold text-white shadow-[0_16px_40px_rgba(109,57,255,0.35)] transition hover:scale-[1.01] md:mt-5 md:h-12 md:px-6 md:text-[14px]"
                >
                  <Download size={17} />
                  Download Multiclout App
                </a>
              </div>

              {relatedVideos.length > 0 && (
                <div className="mt-6 pb-6 md:pb-0">
                  <h2
                    className="mb-4 text-[18px] font-extrabold uppercase tracking-[0.04em] md:text-[18px]"
                    style={{
                      color: isMobile ? "var(--mc-text-main)" : "#ffffff",
                    }}
                  >
                    Recommended
                  </h2>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-3">
                    {recommendedVideos.map((item) => (
                      <RecommendedVideoCard key={item._id} video={item} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="hidden md:block">
          <Footer />
        </div>

        <div className="md:hidden">
          <MobileBottomNav />
        </div>
      </div>
    </>
  );
}

export default VideoDetail;
