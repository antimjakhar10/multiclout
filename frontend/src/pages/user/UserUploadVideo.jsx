import { useEffect, useState } from "react";
import { Eye, Image, UploadCloud, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API } from "../../utils/videoHelpers";

const SERVER_BASE = API.replace(/\/api\/?$/, "");

const initialForm = {
  title: "",
  description: "",
  category: "",
  videoUrl: "",
  duration: "",
};

const getMediaUrl = (value = "") => {
  if (!value) return "";
  if (typeof value !== "string") return "";
  if (/^https?:\/\//i.test(value)) return value;

  const clean = value.replace(/\\/g, "/").replace(/^\/+/, "");
  return `${SERVER_BASE}/${clean}`;
};

const getYoutubeEmbedUrl = (url = "") => {
  if (!url) return "";

  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${parsed.pathname.replace("/", "")}`;
    }

    if (parsed.hostname.includes("youtube.com")) {
      const videoId = parsed.searchParams.get("v");
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;

      if (parsed.pathname.includes("/embed/")) return url;

      if (parsed.pathname.includes("/shorts/")) {
        return `https://www.youtube.com/embed/${parsed.pathname.split("/shorts/")[1]}`;
      }
    }

    return url;
  } catch {
    return url;
  }
};

function UserUploadVideo() {
  const [form, setForm] = useState(initialForm);
  const [thumbnail, setThumbnail] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [myVideos, setMyVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const token =
    localStorage.getItem("userToken") || localStorage.getItem("token");

  useEffect(() => {
    fetchMyVideos();
  }, []);

  const fetchMyVideos = async () => {
    try {
      setFetching(true);

      const res = await fetch(`${API}/videos/user/my-videos`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (data.success) {
        setMyVideos(data.videos || []);
      }
    } catch (error) {
      console.error("My videos fetch error:", error);
    } finally {
      setFetching(false);
    }
  };

  const thumbnailPreview = thumbnail ? URL.createObjectURL(thumbnail) : "";
  const videoPreview = videoFile ? URL.createObjectURL(videoFile) : "";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setThumbnail(null);
    setVideoFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!form.title.trim() || !form.category.trim()) {
      setMessage("Title and category are required.");
      return;
    }

    if (!thumbnail) {
      setMessage("Thumbnail is required.");
      return;
    }

    if (!videoFile && !form.videoUrl.trim()) {
      setMessage("Please upload a video file or enter a video URL.");
      return;
    }

    try {
      setLoading(true);

      const fd = new FormData();
      fd.append("title", form.title.trim());
      fd.append("description", form.description.trim());
      fd.append("category", form.category.trim());
      fd.append("videoUrl", form.videoUrl.trim());
      fd.append("duration", form.duration.trim());

      fd.append("thumbnail", thumbnail);
      if (videoFile) fd.append("videoFile", videoFile);

      const res = await fetch(`${API}/videos/user/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage(data.message || "Failed to submit video.");
        return;
      }

      setMessage(
        "Video submitted successfully. It will be visible on Watch Videos after admin approval.",
      );
      resetForm();
      fetchMyVideos();
    } catch (error) {
      console.error("Video submit error:", error);
      setMessage("Something went wrong while submitting video.");
    } finally {
      setLoading(false);
    }
  };

  const statusStyle = {
    pending: "bg-yellow-500/15 text-yellow-300",
    approved: "bg-emerald-500/15 text-emerald-300",
    rejected: "bg-red-500/15 text-red-300",
  };

  return (
    <div className="space-y-5">
      <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6 sm:p-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300/85">
          Upload Video
        </p>
        <h2 className="mt-3 text-[28px] font-bold leading-[1.12] text-white sm:text-[34px]">
          Submit your learning video
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
          Your video will be reviewed by admin. After approval, it will appear
          on Watch Videos.
        </p>
      </div>

      <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 sm:p-6">
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <Input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Video title"
            required
          />
          <Input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category"
            required
          />
          <Input
            name="duration"
            value={form.duration}
            onChange={handleChange}
            placeholder="Duration e.g. 5 mins"
          />
          <Input
            name="videoUrl"
            value={form.videoUrl}
            onChange={handleChange}
            placeholder="YouTube / video URL optional"
          />

          <div className="md:col-span-2">
            <Textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Video description"
            />
          </div>

          <FileInput
            icon={Image}
            label="Thumbnail"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
          />

          <FileInput
            icon={Video}
            label="Video File"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
          />

          {(thumbnailPreview || videoPreview) && (
            <div className="md:col-span-2 grid gap-4 md:grid-cols-2">
              {thumbnailPreview && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="mb-3 text-sm font-semibold text-white">
                    Thumbnail Preview
                  </p>
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail Preview"
                    className="h-[220px] w-full rounded-xl object-cover"
                  />
                </div>
              )}

              {videoPreview && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="mb-3 text-sm font-semibold text-white">
                    Video Preview
                  </p>
                  <video
                    src={videoPreview}
                    controls
                    className="h-[220px] w-full rounded-xl bg-black object-contain"
                  />
                </div>
              )}
            </div>
          )}

          {message ? (
            <div className="md:col-span-2 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-200">
              {message}
            </div>
          ) : null}

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-6 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(16,185,129,0.24)] transition hover:opacity-95 disabled:opacity-70"
            >
              <UploadCloud size={17} />
              {loading ? "Submitting..." : "Submit for Approval"}
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 sm:p-6">
        <h3 className="text-xl font-bold text-white">My Submitted Videos</h3>

        {fetching ? (
          <p className="mt-4 text-sm text-white/55">Loading videos...</p>
        ) : myVideos.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-5 py-10 text-center text-sm text-white/55">
            No videos submitted yet.
          </div>
        ) : (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {myVideos.map((item) => (
              <div
                key={item._id}
                className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-4"
              >
                <div className="h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-black">
                  <img
                    src={getMediaUrl(item.thumbnail)}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="line-clamp-2 text-base font-semibold text-white">
                    {item.title}
                  </h4>

                  <p className="mt-1 text-sm text-white/50">{item.category}</p>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyle[item.approvalStatus] || statusStyle.pending}`}
                    >
                      {item.approvalStatus || "pending"}
                    </span>

                    <span className="rounded-full bg-white/8 px-3 py-1 text-xs text-white/60">
                      {new Date(item.createdAt).toLocaleDateString("en-IN")}
                    </span>
                  </div>

                  {item.rejectionReason ? (
                    <p className="mt-2 text-xs leading-5 text-red-300">
                      Reason: {item.rejectionReason}
                    </p>
                  ) : null}

                  <button
                    onClick={() => {
                      if (item.approvalStatus !== "approved") {
                        alert(
                          "This video will be visible on Watch Videos after admin approval.",
                        );
                        return;
                      }

                      navigate(`/watch-videos/${item.slug}`);
                    }}
                    className="mt-3 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-white/[0.08]"
                  >
                    <Eye size={15} />
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

function UserVideoModal({ video, onClose }) {
  const videoSrc = video.videoFile
    ? getMediaUrl(video.videoFile)
    : video.videoUrl || "";
  const embedUrl =
    !video.videoFile && video.videoUrl
      ? getYoutubeEmbedUrl(video.videoUrl)
      : "";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 px-4">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[28px] border border-white/10 bg-[#101b28] p-5 shadow-2xl md:p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">{video.title}</h2>
            <p className="mt-1 text-sm text-white/55">
              Status:{" "}
              <span className="capitalize text-cyan-300">
                {video.approvalStatus || "pending"}
              </span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
          <div>
            <p className="mb-2 text-sm font-semibold text-white/75">
              Thumbnail
            </p>
            <img
              src={getMediaUrl(video.thumbnail)}
              alt={video.title}
              className="w-full rounded-2xl border border-white/10 object-cover"
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-white/75">
              Video Preview
            </p>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
              {video.videoFile ? (
                <video
                  src={videoSrc}
                  controls
                  className="max-h-[440px] w-full bg-black object-contain"
                />
              ) : embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={video.title}
                  className="h-[420px] w-full bg-black"
                  allowFullScreen
                />
              ) : (
                <div className="flex h-[260px] items-center justify-center text-white/60">
                  No video available
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <p className="text-sm text-white/50">Category</p>
          <p className="mt-1 font-semibold text-white">
            {video.category || "-"}
          </p>

          <p className="mt-4 text-sm text-white/50">Description</p>
          <p className="mt-1 text-sm leading-7 text-white/75">
            {video.description || "-"}
          </p>
        </div>
      </div>
    </div>
  );
}

function Input({ name, value, onChange, placeholder, required = false }) {
  return (
    <input
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="h-[52px] w-full rounded-2xl border border-white/10 bg-white px-4 text-[15px] text-[#0f172a] outline-none placeholder:text-slate-400 focus:border-cyan-400"
    />
  );
}

function Textarea({ name, value, onChange, placeholder }) {
  return (
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows={5}
      placeholder={placeholder}
      className="w-full rounded-2xl border border-white/10 bg-white px-4 py-3 text-[15px] text-[#0f172a] outline-none placeholder:text-slate-400 focus:border-cyan-400"
    />
  );
}

function FileInput({ icon: Icon, label, accept, onChange }) {
  return (
    <label className="block rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <span className="mb-2 flex items-center gap-2 text-sm font-medium text-white/75">
        <Icon size={16} />
        {label}
      </span>

      <input
        type="file"
        accept={accept}
        onChange={onChange}
        className="block w-full rounded-xl border border-white/10 bg-white px-3 py-2 text-sm text-[#0f172a]"
      />
    </label>
  );
}

export default UserUploadVideo;
