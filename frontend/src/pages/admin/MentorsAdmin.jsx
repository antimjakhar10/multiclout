import { useEffect, useMemo, useState } from "react";
import { API, getAuthHeaders } from "../../utils/api";
import { getImageUrl } from "../../utils/videoHelpers";

const initialForm = {
  name: "",
  role: "",
  bio: "",
  videosCount: "",
  viewsCount: "",
  image: null,
};

function MentorsAdmin() {
  const [mentors, setMentors] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API}/mentors/admin/all`, {
        headers: getAuthHeaders(),
      });

      const text = await res.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch (error) {
        console.error("Mentors admin fetch non-json:", text);
        throw new Error("Mentors fetch failed");
      }

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch mentors");
      }

      setMentors(data.mentors || []);
    } catch (error) {
      alert(error.message || "Failed to fetch mentors");
    } finally {
      setLoading(false);
    }
  };

  const previewImage = useMemo(() => {
    if (form.image instanceof File) {
      return URL.createObjectURL(form.image);
    }

    if (existingImage) {
  return getImageUrl(existingImage);
}

    return "";
  }, [form.image, existingImage]);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setExistingImage("");
  };

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    if (type === "file") {
      setForm((prev) => ({
        ...prev,
        [name]: files?.[0] || null,
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = (mentor) => {
    setEditingId(mentor._id);
    setForm({
      name: mentor.name || "",
      role: mentor.role || "",
      bio: mentor.bio || mentor.desc || "",
      videosCount: mentor.videosCount || "",
      viewsCount: mentor.viewsCount || "",
      image: null,
    });
    setExistingImage(mentor.image || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this mentor?");
    if (!ok) return;

    try {
      const res = await fetch(`${API}/mentors/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      const text = await res.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch (error) {
        console.error("Mentor delete non-json:", text);
        throw new Error("Delete failed");
      }

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Delete failed");
      }

      fetchMentors();
    } catch (error) {
      alert(error.message || "Delete failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const fd = new FormData();
      fd.append("name", form.name || "");
      fd.append("role", form.role || "");
      fd.append("bio", form.bio || "");
      fd.append("videosCount", form.videosCount || "");
      fd.append("viewsCount", form.viewsCount || "");

      if (form.image instanceof File) {
        fd.append("image", form.image);
      }

      const url = editingId
        ? `${API}/mentors/${editingId}`
        : `${API}/mentors/add`;

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(true),
        body: fd,
      });

      const text = await res.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch (error) {
        console.error("Mentor save non-json:", text);
        throw new Error("Backend error aa rahi hai");
      }

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Save failed");
      }

      resetForm();
      fetchMentors();
    } catch (error) {
      alert(error.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1450px] space-y-6 p-4 md:p-6">
      <div className="rounded-[28px] bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Mentors</h2>
            <p className="mt-1 text-sm text-slate-500">
              Add, update and manage mentors from here.
            </p>
          </div>

          {editingId ? (
            <button
              onClick={resetForm}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
            >
              Cancel Edit
            </button>
          ) : null}
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter Name"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Role
            </label>
            <input
              type="text"
              name="role"
              value={form.role}
              onChange={handleChange}
              placeholder="e.g. Business Mentor"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Bio
            </label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={5}
              placeholder="Enter Bio"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Videos Count
            </label>
            <input
              type="text"
              name="videosCount"
              value={form.videosCount}
              onChange={handleChange}
              placeholder="e.g. 150+"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Views Count
            </label>
            <input
              type="text"
              name="viewsCount"
              value={form.viewsCount}
              onChange={handleChange}
              placeholder="e.g. 2M+"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Mentor Image
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
            />

            {previewImage ? (
              <div className="mt-3">
                <img
                  src={previewImage}
                  alt="Mentor Preview"
                  className="h-24 w-24 rounded-2xl border border-slate-200 object-cover"
                />
              </div>
            ) : null}
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-slate-900 px-6 py-3 font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              {saving ? "Saving..." : editingId ? "Update Mentor" : "Add Mentor"}
            </button>
          </div>
        </form>
      </div>

      <div className="overflow-hidden rounded-[28px] bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-900">All Mentors</h3>
        </div>

        {loading ? (
          <div className="p-6 text-slate-500">Loading...</div>
        ) : mentors.length === 0 ? (
          <div className="p-6 text-slate-500">No mentors found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Videos Count</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Views Count</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Mentor Image</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mentors.map((mentor) => {
                  const image = getImageUrl(mentor.image);

                  return (
                    <tr key={mentor._id} className="border-t border-slate-100">
                      <td className="px-6 py-4 text-sm text-slate-600">{mentor.name || "-"}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{mentor.role || "-"}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{mentor.videosCount || "-"}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{mentor.viewsCount || "-"}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {image ? (
                          <img
                            src={image}
                            alt={mentor.name}
                            className="h-14 w-14 rounded-xl border border-slate-200 object-cover"
                          />
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(mentor)}
                            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(mentor._id)}
                            className="rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default MentorsAdmin;