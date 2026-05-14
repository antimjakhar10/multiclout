import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  API,
  getImageUrl,
  getFallbackImageUrl,
  getVideoUrl,
  getFallbackVideoUrl,
} from "../../utils/videoHelpers";

const initialForm = {
  title: "",
  description: "",
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
  category: "",
  videoUrl: "",
  duration: "",
  views: "0",
  likes: "0",
  shares: "0",
  rating: "4.5",
  accessType: "free",
  featured: false,
  topPick: false,
  active: true,
  order: "0",
};

const defaultCategoryOptions = [
  "Youtube",
  "Instagram",
  "Business",
  "Finance",
  "Health",
  "Knowledge",
  "Motivation",
  "Tutorials",
  "Growth",
];

function getYoutubeEmbedUrl(url = "") {
  if (!url) return "";

  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtube.com")) {
      const videoId = parsed.searchParams.get("v");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
    }

    if (parsed.hostname.includes("youtu.be")) {
      const videoId = parsed.pathname.replace("/", "");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
    }

    return "";
  } catch {
    return "";
  }
}

function isDirectVideo(url = "") {
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
}

function makeSlugPreview(value = "") {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

function VideosAdmin() {
  const [videos, setVideos] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [thumbnail, setThumbnail] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const [existingThumb, setExistingThumb] = useState("");
  const [existingVideoFile, setExistingVideoFile] = useState("");

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const adminToken = localStorage.getItem("adminToken");

      const res = await fetch(`${API}/videos/admin/all`, {
        headers: adminToken
          ? {
              Authorization: `Bearer ${adminToken}`,
            }
          : {},
      });

      const data = await res.json();

      if (data.success) {
        setVideos(data.videos || []);
      } else {
        console.error("Fetch videos failed:", data.message);
        setVideos([]);
      }
    } catch (error) {
      console.error("Fetch videos error:", error);
      setVideos([]);
    }
  };

  useEffect(() => {
    const editId = searchParams.get("edit");

    if (!editId || videos.length === 0) return;

    const targetVideo = videos.find((item) => item._id === editId);

    if (targetVideo) {
      handleEdit(targetVideo);
      setSearchParams({}, { replace: true });
    }
  }, [videos, searchParams, setSearchParams]);

  const categoryOptions = useMemo(() => {
    const existingCategories = videos
      .map((item) => (item.category || "").trim())
      .filter(Boolean);

    return [
      ...new Set([...defaultCategoryOptions, ...existingCategories]),
    ].sort((a, b) => a.localeCompare(b));
  }, [videos]);

  const filteredVideos = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    const visibleVideos = videos.filter((video) => {
      if (!video.approvalStatus) return true;
      return video.approvalStatus === "approved";
    });

    if (!query) return visibleVideos;

    return visibleVideos.filter((video) => {
      const title = video.title?.toLowerCase() || "";
      const description = video.description?.toLowerCase() || "";
      const category = video.category?.toLowerCase() || "";

      return (
        title.includes(query) ||
        description.includes(query) ||
        category.includes(query)
      );
    });
  }, [videos, searchTerm]);

  const slugPreview = useMemo(() => makeSlugPreview(form.title), [form.title]);

  const thumbnailPreview = useMemo(() => {
    if (thumbnail) return URL.createObjectURL(thumbnail);
    if (existingThumb) return getImageUrl(existingThumb);
    return "";
  }, [thumbnail, existingThumb]);

  const thumbnailFallbackPreview = useMemo(() => {
    if (thumbnail) return "";
    if (existingThumb) return getFallbackImageUrl(existingThumb);
    return "";
  }, [thumbnail, existingThumb]);

  const uploadedVideoPreview = useMemo(() => {
    if (videoFile) return URL.createObjectURL(videoFile);
    if (existingVideoFile) return getVideoUrl(existingVideoFile);
    return "";
  }, [videoFile, existingVideoFile]);

  const uploadedVideoFallbackPreview = useMemo(() => {
    if (videoFile) return "";
    if (existingVideoFile) return getFallbackVideoUrl(existingVideoFile);
    return "";
  }, [videoFile, existingVideoFile]);

  const youtubeEmbedUrl = useMemo(() => {
    if (!form.videoUrl || isDirectVideo(form.videoUrl)) return "";
    return getYoutubeEmbedUrl(form.videoUrl);
  }, [form.videoUrl]);

  const directUrlPreview = useMemo(() => {
    if (!form.videoUrl) return "";
    return isDirectVideo(form.videoUrl) ? form.videoUrl : "";
  }, [form.videoUrl]);

  const resetForm = () => {
    setForm(initialForm);
    setThumbnail(null);
    setVideoFile(null);
    setEditingId(null);
    setExistingThumb("");
    setExistingVideoFile("");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEdit = (video) => {
    setEditingId(video._id);
    setForm({
      title: video.title || "",
      description: video.description || "",
      seoTitle: video.seoTitle || "",
      seoDescription: video.seoDescription || "",
      seoKeywords: video.seoKeywords || "",
      category: video.category || "",
      videoUrl: video.videoUrl || "",
      duration: video.duration || "",
      views: video.views || "0",
      likes: video.likes || "0",
      shares: video.shares || "0",
      rating: String(video.rating ?? 4.5),
      accessType: video.accessType || "free",
      featured: !!video.featured,
      topPick: !!video.topPick,
      active: !!video.active,
      order: String(video.order ?? 0),
    });

    setExistingThumb(video.thumbnail || "");
    setExistingVideoFile(video.videoFile || "");
    setThumbnail(null);
    setVideoFile(null);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentTopPicks = videos.filter((item) => item.topPick);
    const editingVideo = videos.find((item) => item._id === editingId);

    if (!form.category.trim()) {
      alert("Category is required");
      return;
    }

    try {
      setLoading(true);

      const fd = new FormData();

      Object.keys(form).forEach((key) => {
        if (key === "category") {
          fd.append(key, form[key].trim());
        } else {
          fd.append(key, form[key]);
        }
      });

      if (thumbnail) fd.append("thumbnail", thumbnail);
      if (videoFile) fd.append("videoFile", videoFile);

      const url = editingId
        ? `${API}/videos/admin/update/${editingId}`
        : `${API}/videos/admin/add`;

      const method = editingId ? "PUT" : "POST";

      const adminToken = localStorage.getItem("adminToken");

      const res = await fetch(url, {
        method,
        headers: adminToken
          ? {
              Authorization: `Bearer ${adminToken}`,
            }
          : {},
        body: fd,
      });

      const data = await res.json();

      if (data.success) {
        alert(
          editingId ? "Video updated successfully" : "Video added successfully",
        );
        resetForm();
        fetchVideos();
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Save video error:", error);
      alert("Failed to save video");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this video?");
    if (!ok) return;

    try {
      const adminToken = localStorage.getItem("adminToken");

      const res = await fetch(`${API}/videos/admin/delete/${id}`, {
        method: "DELETE",
        headers: adminToken
          ? {
              Authorization: `Bearer ${adminToken}`,
            }
          : {},
      });
      const data = await res.json();

      if (data.success) {
        fetchVideos();
      } else {
        alert(data.message || "Delete failed");
      }
    } catch (error) {
      console.error("Delete video error:", error);
      alert("Delete failed");
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1450px] space-y-6 p-4 md:p-6">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#07111a]">
            {editingId ? "Edit Video" : "Add Video"}
          </h2>
          <p className="mt-2 text-sm md:text-base text-slate-600">
            Add, Update and Manage videos from here
          </p>
        </div>

        <div className="p-5 md:p-6">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]"
          >
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input
                  name="title"
                  placeholder="Video title"
                  value={form.title}
                  onChange={handleChange}
                  required
                />

                <div className="space-y-2">
                  <Input
                    name="category"
                    list="video-category-options"
                    placeholder="Select or type category"
                    value={form.category}
                    onChange={handleChange}
                    required
                  />
                  <datalist id="video-category-options">
                    {categoryOptions.map((item) => (
                      <option key={item} value={item} />
                    ))}
                  </datalist>
                  <p className="text-xs text-slate-500">
                    Select from existing categories or enter a new one as
                    needed.
                  </p>
                </div>

                <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="mb-4 text-lg font-semibold text-[#07111a]">
                    SEO Settings
                  </h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Input
                      name="seoTitle"
                      placeholder="SEO title"
                      value={form.seoTitle}
                      onChange={handleChange}
                    />

                    <Input
                      name="seoKeywords"
                      placeholder="SEO keywords"
                      value={form.seoKeywords}
                      onChange={handleChange}
                    />

                    <div className="md:col-span-2">
                      <Textarea
                        name="seoDescription"
                        placeholder="SEO description"
                        value={form.seoDescription}
                        onChange={handleChange}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <p className="text-sm text-slate-500">
                    Slug Preview:{" "}
                    <span className="font-medium text-[#167a7a]">
                      {slugPreview || "video-slug-preview"}
                    </span>
                  </p>
                </div>

                <Input
                  name="duration"
                  placeholder="Duration (e.g. 5 mins)"
                  value={form.duration}
                  onChange={handleChange}
                />

                <Input
                  type="number"
                  name="order"
                  placeholder="Display Order"
                  value={form.order}
                  onChange={handleChange}
                />

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#07111a]">
                    Video Access
                  </label>

                  <select
                    name="accessType"
                    value={form.accessType}
                    onChange={handleChange}
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-[15px] text-[#07111a] outline-none transition focus:border-[#167a7a] focus:ring-2 focus:ring-[#167a7a]/10"
                  >
                    <option value="free">Free</option>
                    <option value="subscriber">Subscriber Only</option>
                  </select>

                  <p className="text-xs text-slate-500">
                    Free videos are available to everyone. Subscriber-only
                    videos stay locked until the user has an active or trial
                    subscription.
                  </p>
                </div>

                <div className="md:col-span-2 mt-2">
                  <p className="text-sm font-semibold text-[#07111a]">
                    Card Stats
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Views, Likes, Share
                  </p>
                </div>

                <Input
                  name="views"
                  placeholder="Views"
                  value={form.views}
                  onChange={handleChange}
                />
                <Input
                  name="likes"
                  placeholder="Likes"
                  value={form.likes}
                  onChange={handleChange}
                />
                <Input
                  name="shares"
                  placeholder="Shares"
                  value={form.shares}
                  onChange={handleChange}
                />

                <Input
                  type="number"
                  step="0.1"
                  name="rating"
                  placeholder="Rating"
                  value={form.rating}
                  onChange={handleChange}
                />

                <Input
                  name="videoUrl"
                  placeholder="YouTube / direct video URL (optional)"
                  value={form.videoUrl}
                  onChange={handleChange}
                />

                <div className="md:col-span-2">
                  <Textarea
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                    rows="5"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#07111a]">
                    Thumbnail
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setThumbnail(e.target.files[0])}
                    className="block h-11 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium"
                    required={!editingId}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#07111a]">
                    Video File
                  </label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideoFile(e.target.files[0])}
                    className="block h-11 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium"
                  />
                </div>

                <div className="md:col-span-2 flex flex-wrap gap-6 pt-1">
                  <Checkbox
                    name="featured"
                    label="Featured"
                    checked={form.featured}
                    onChange={handleChange}
                  />
                  <Checkbox
                    name="topPick"
                    label="Top Pick"
                    checked={form.topPick}
                    onChange={handleChange}
                  />
                  <Checkbox
                    name="active"
                    label="Active"
                    checked={form.active}
                    onChange={handleChange}
                  />
                </div>

                <div className="md:col-span-2 flex flex-wrap gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-xl bg-gradient-to-r from-[#0b5c8e] via-[#167a7a] to-[#2e8b57] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:opacity-60"
                  >
                    {loading
                      ? "Saving..."
                      : editingId
                        ? "Update Video"
                        : "Add Video"}
                  </button>

                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
              <h3 className="text-lg font-semibold text-[#07111a]">Preview</h3>

              <div className="mt-4">
                <p className="mb-2 text-sm font-medium text-slate-600">
                  Thumbnail Preview
                </p>
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  {thumbnailPreview ? (
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      onError={(e) => {
                        if (
                          thumbnailFallbackPreview &&
                          e.currentTarget.src !== thumbnailFallbackPreview
                        ) {
                          e.currentTarget.src = thumbnailFallbackPreview;
                        }
                      }}
                      className="aspect-[3/4] w-full object-cover"
                    />
                  ) : (
                    <div className="flex aspect-[3/4] items-center justify-center text-slate-400">
                      No thumbnail
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5">
                <p className="mb-2 text-sm font-medium text-slate-600">
                  Video Preview
                </p>
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-black">
                  {uploadedVideoPreview ? (
                    <video
                      src={uploadedVideoPreview}
                      controls
                      onError={(e) => {
                        if (
                          uploadedVideoFallbackPreview &&
                          e.currentTarget.src !== uploadedVideoFallbackPreview
                        ) {
                          e.currentTarget.src = uploadedVideoFallbackPreview;
                          e.currentTarget.load();
                        }
                      }}
                      className="aspect-[9/16] w-full bg-black object-cover"
                    />
                  ) : directUrlPreview ? (
                    <video
                      src={directUrlPreview}
                      controls
                      className="aspect-[9/16] w-full bg-black object-cover"
                    />
                  ) : youtubeEmbedUrl ? (
                    <iframe
                      src={youtubeEmbedUrl}
                      title="YouTube preview"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="aspect-[9/16] w-full bg-black"
                    />
                  ) : (
                    <div className="flex aspect-[9/16] items-center justify-center text-slate-400">
                      No video selected
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-sm text-slate-500">Detail Page CTA</p>
                <p className="mt-2 text-base font-semibold text-[#07111a]">
                  Download Multiclout App
                </p>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-sm text-slate-500">Access Type</p>
                <p className="mt-2 text-base font-semibold text-[#07111a]">
                  {form.accessType === "subscriber"
                    ? "Subscriber Only"
                    : "Free"}
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4 md:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#07111a]">All Videos</h2>
              <p className="mt-1 text-sm text-slate-500">
                Search videos by title, description, or category.
              </p>
            </div>

            <div className="relative w-full lg:max-w-[420px]">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search videos..."
                className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 pr-10 text-sm text-[#07111a] outline-none transition focus:border-[#167a7a] focus:ring-2 focus:ring-[#167a7a]/10"
              />

              {searchTerm ? (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400 hover:text-red-500"
                >
                  ×
                </button>
              ) : null}
            </div>
          </div>
        </div>

        <div className="p-5 md:p-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {filteredVideos.map((video) => (
              <div
                key={video._id}
                className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-4"
              >
                <img
                  src={getImageUrl(video.thumbnail)}
                  alt={video.title}
                  onError={(e) => {
                    const fallback = getFallbackImageUrl(video.thumbnail);

                    if (fallback && e.currentTarget.src !== fallback) {
                      e.currentTarget.src = fallback;
                    }
                  }}
                  className="h-28 w-24 rounded-xl object-cover"
                />

                <div className="min-w-0 flex-1">
                  <h3 className="line-clamp-2 text-lg font-semibold text-[#07111a]">
                    {video.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {video.category}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {video.duration} • {video.rating}
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    Views: {video.views || "0"} • Likes: {video.likes || "0"} •
                    Shares: {video.shares || "0"}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Tag>{video.active ? "Active" : "Inactive"}</Tag>

                    {video.accessType === "subscriber" ? (
                      <Tag color="purple">Subscriber Only</Tag>
                    ) : (
                      <Tag color="green">Free</Tag>
                    )}

                    {video.topPick && <Tag color="teal">Top Pick</Tag>}
                    {video.featured && <Tag color="yellow">Featured</Tag>}
                    {video.videoFile && <Tag color="blue">Uploaded Video</Tag>}
                    {video.videoUrl && <Tag color="purple">URL Video</Tag>}
                  </div>

                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => handleEdit(video)}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(video._id)}
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {!filteredVideos.length && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-slate-500 lg:col-span-2">
                {searchTerm
                  ? "No videos found for your search."
                  : "No videos added yet."}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideosAdmin;

function Input({
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required = false,
  list,
  step,
}) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      list={list}
      step={step}
      className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-[15px] text-[#07111a] outline-none transition focus:border-[#167a7a] focus:ring-2 focus:ring-[#167a7a]/10"
    />
  );
}

function Textarea({ name, value, onChange, placeholder, rows = 4 }) {
  return (
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows={rows}
      placeholder={placeholder}
      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-[15px] text-[#07111a] outline-none transition focus:border-[#167a7a] focus:ring-2 focus:ring-[#167a7a]/10"
    />
  );
}

function Checkbox({ name, label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 text-sm font-medium text-[#07111a]">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
      />
      {label}
    </label>
  );
}

function Tag({ children, color = "default" }) {
  const styles = {
    default: "bg-slate-100 text-slate-700",
    teal: "bg-[#167a7a]/10 text-[#167a7a]",
    yellow: "bg-yellow-100 text-yellow-700",
    blue: "bg-blue-100 text-blue-700",
    purple: "bg-purple-100 text-purple-700",
    green: "bg-emerald-100 text-emerald-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${styles[color]}`}
    >
      {children}
    </span>
  );
}
