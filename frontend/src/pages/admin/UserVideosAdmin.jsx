import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Eye,
  Pencil,
  Search,
  Trash2,
  X,
  XCircle,
} from "lucide-react";
import { API } from "../../utils/videoHelpers";

const SERVER_BASE = API.replace(/\/api\/?$/, "");

const getMediaUrl = (value = "") => {
  if (!value) return "";
  if (typeof value !== "string") return "";
  if (/^https?:\/\//i.test(value)) return value;

  const clean = value.replace(/\\/g, "/").replace(/^\/+/, "");
  return `${SERVER_BASE}/${clean}`;
};

function UserVideosAdmin() {
  const navigate = useNavigate();

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingStatus, setSavingStatus] = useState(false);
  const [search, setSearch] = useState("");
  const [viewVideo, setViewVideo] = useState(null);

  const adminToken = localStorage.getItem("adminToken");

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API}/videos/admin/user-videos`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      const data = await res.json();

      if (data.success) {
        setVideos(data.videos || []);
      }
    } catch (error) {
      console.error("User videos fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVideos = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return videos;

    return videos.filter((item) => {
      return (
        item.title?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q) ||
        item.uploadedBy?.name?.toLowerCase().includes(q) ||
        item.uploadedBy?.phone?.toLowerCase().includes(q) ||
        item.approvalStatus?.toLowerCase().includes(q)
      );
    });
  }, [videos, search]);

  const updateStatus = async (id, status) => {
    const rejectionReason =
      status === "rejected"
        ? window.prompt("Enter rejection reason optional:") || ""
        : "";

    try {
      setSavingStatus(true);

      const res = await fetch(`${API}/videos/admin/user-videos/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ status, rejectionReason }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.message || "Status update failed");
        return;
      }

      fetchVideos();
    } catch (error) {
      alert("Status update failed");
    } finally {
      setSavingStatus(false);
    }
  };

 const handleDelete = async (id) => {
  try {
    // STEP 1 → REASON
    const reason = window.prompt(
      "Enter delete reason:"
    );

    // cancel pressed
    if (reason === null) return;

    // empty reason not allowed
    if (!reason.trim()) {
      alert("Delete reason is required");
      return;
    }

    // STEP 2 → CONFIRM DELETE
    const confirmDelete = window.confirm(
      `Are you sure you want to delete this video?\n\nReason: ${reason}`
    );

    if (!confirmDelete) return;

    // STEP 3 → DELETE API
    const res = await fetch(
      `${API}/videos/admin/delete/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          reason,
        }),
      }
    );

    const data = await res.json();

    if (data.success) {

  // instantly remove from UI
  setVideos((prev) =>
    prev.filter((item) => item._id !== id)
  );

  // success popup
  alert("Video deleted successfully");
} else {
      alert(data.message || "Delete failed");
    }
  } catch (error) {
    console.error(error);
    alert("Delete failed");
  }
};

  const statusClass = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-emerald-100 text-emerald-700",
    rejected: "bg-red-100 text-red-700",
  };

  return (
    <div className="mx-auto w-full max-w-[1450px] space-y-6 p-4 md:p-6">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4 md:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#07111a] md:text-3xl">
                User Videos
              </h1>
              <p className="mt-2 text-sm text-slate-600 md:text-base">
                Review, approve, reject, view and delete videos uploaded by
                users.
              </p>
            </div>

            <div className="relative w-full lg:max-w-[420px]">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search user videos..."
                className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-sm text-[#07111a] outline-none focus:border-[#167a7a]"
              />
            </div>
          </div>
        </div>

        <div className="p-5 md:p-6">
          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-slate-500">
              Loading user videos...
            </div>
          ) : filteredVideos.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-slate-500">
              No user videos found.
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <div className="overflow-x-auto">
                <table className=" w-full text-sm">
                  <thead className="bg-slate-50 text-left">
                    <tr className="border-b border-slate-200">
                      <th className="px-4 py-4 font-semibold text-[#07111a]">
                        Thumbnail
                      </th>
                      <th className="px-4 py-4 font-semibold text-[#07111a]">
                        Video Details
                      </th>
                      <th className="px-4 py-4 font-semibold text-[#07111a]">
                        User
                      </th>
                      <th className="px-4 py-4 font-semibold text-[#07111a]">
                        Status
                      </th>
                      <th className="px-4 py-4 font-semibold text-[#07111a]">
                        Date
                      </th>
                      <th className="px-4 py-4 font-semibold text-[#07111a]">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200 bg-white">
                    {filteredVideos.map((video) => (
                      <tr key={video._id} className="align-top">
                        <td className="px-4 py-4">
                          <div className="h-20 w-16 overflow-hidden rounded-xl bg-black">
                            <img
                              src={getMediaUrl(video.thumbnail)}
                              alt={video.title}
                              onError={(e) => {
                                e.currentTarget.src =
                                  "https://via.placeholder.com/300x400?text=No+Thumbnail";
                              }}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <h3 className="line-clamp-2 max-w-[320px] font-bold text-[#07111a]">
                            {video.title}
                          </h3>
                          <p className="mt-1 text-slate-600">
                            {video.category || "-"} • {video.duration || "-"}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {video.videoFile ? "Uploaded File" : "URL Video"}
                          </p>
                        </td>

                        <td className="px-4 py-4 text-slate-700">
                          <p className="font-semibold">
                            {video.uploadedBy?.name || "User"}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {video.uploadedBy?.phone ||
                              video.uploadedBy?.email ||
                              "-"}
                          </p>
                        </td>

                        <td className="px-4 py-4">
                          <select
                            value={video.approvalStatus || "pending"}
                            disabled={savingStatus}
                            onChange={(e) =>
                              updateStatus(video._id, e.target.value)
                            }
                            className={`h-10 min-w-[130px] rounded-xl border px-3 text-xs font-semibold capitalize outline-none ${
                              video.approvalStatus === "approved"
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : video.approvalStatus === "rejected"
                                  ? "border-red-200 bg-red-50 text-red-700"
                                  : "border-yellow-200 bg-yellow-50 text-yellow-700"
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                          </select>

                          {video.rejectionReason ? (
                            <p className="mt-2 max-w-[180px] text-xs leading-5 text-red-600">
                              {video.rejectionReason}
                            </p>
                          ) : null}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                          {new Date(video.createdAt).toLocaleString("en-IN")}
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              title="View"
                              onClick={() => setViewVideo(video)}
                              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                            >
                              <Eye size={16} />
                            </button>

                            <button
                              title="Edit"
                              onClick={() =>
                                navigate(`/admin/videos?edit=${video._id}`)
                              }
                              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                            >
                              <Pencil size={16} />
                            </button>

                            <button
                              title="Delete"
                              onClick={() => handleDelete(video._id)}
                              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white hover:bg-red-700"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {viewVideo ? (
        <ViewVideoModal video={viewVideo} onClose={() => setViewVideo(null)} />
      ) : null}
    </div>
  );
}

function ViewVideoModal({ video, onClose }) {
  const videoSrc = video.videoFile
    ? getMediaUrl(video.videoFile)
    : video.videoUrl || "";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 px-4">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl md:p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#07111a]">{video.title}</h2>
            <p className="mt-1 text-sm text-slate-500">
              Uploaded by {video.uploadedBy?.name || "User"}
            </p>
          </div>

          <button
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 text-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
          <div>
            <p className="mb-2 text-sm font-semibold text-slate-700">
              Thumbnail
            </p>
            <img
              src={getMediaUrl(video.thumbnail)}
              alt={video.title}
              className="w-full rounded-2xl border border-slate-200 object-cover"
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-slate-700">
              Video Preview
            </p>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-black">
              {video.videoFile ? (
                <video
                  src={videoSrc}
                  controls
                  className="max-h-[440px] w-full bg-black object-contain"
                />
              ) : video.videoUrl ? (
                <iframe
                  src={video.videoUrl}
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

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Info label="Category" value={video.category} />
          <Info label="Duration" value={video.duration} />
          <Info label="Status" value={video.approvalStatus} />
          <Info
            label="Submitted On"
            value={new Date(video.createdAt).toLocaleString("en-IN")}
          />
          <div className="md:col-span-2">
            <Info label="Description" value={video.description || "-"} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-700">{value || "-"}</p>
    </div>
  );
}

export default UserVideosAdmin;
