import { useEffect, useState } from "react";
import { API, getAdminToken } from "../../utils/api";

const emptyForm = {
  title: "",
  videoUrl: "",
  description: "",
  order: "",
  active: true,
};

function TutorialsAdmin() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const token = getAdminToken();

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/tutorials/admin/all`, {
        headers: authHeaders,
      });
      const data = await res.json();
      setItems(data.tutorials || []);
    } catch (error) {
      console.error("Tutorials fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEdit = (item) => {
    setForm({
      title: item.title || "",
      videoUrl: item.videoUrl || "",
      description: item.description || "",
      order: item.order ?? "",
      active: item.active ?? true,
    });

    setEditingId(item._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this tutorial?");
    if (!ok) return;

    try {
      const res = await fetch(`${API}/tutorials/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });

      const data = await res.json();

      if (!data.success && res.status >= 400) {
        throw new Error(data.message || "Delete failed");
      }

      fetchItems();
    } catch (error) {
      alert(error.message || "Delete failed");
    }
  };

  const isValidYouTubeUrl = (url = "") => {
  const cleanUrl = String(url).trim();

  return (
    cleanUrl.includes("youtube.com/watch?v=") ||
    cleanUrl.includes("youtu.be/") ||
    cleanUrl.includes("youtube.com/embed/") ||
    cleanUrl.includes("youtube.com/shorts/")
  );
};

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!isValidYouTubeUrl(form.videoUrl)) {
    alert("Please enter a valid YouTube link");
    return;
  }

  try {
    setSaving(true);

    const url = editingId
      ? `${API}/tutorials/${editingId}`
      : `${API}/tutorials/add`;

    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: authHeaders,
      body: JSON.stringify({
        title: form.title,
        videoUrl: form.videoUrl,
        description: form.description,
        order: form.order || 0,
        active: form.active,
      }),
    });

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.message || "Save failed");
    }

    resetForm();
    fetchItems();
  } catch (error) {
    alert(error.message || "Save failed");
  } finally {
    setSaving(false);
  }
};

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Tutorials</h2>
            <p className="mt-1 text-sm text-slate-500">
              Add, update and manage tutorials from here.
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
              Title
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter tutorial title"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Order
            </label>
            <input
              type="number"
              name="order"
              value={form.order}
              onChange={handleChange}
              placeholder="0"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              YouTube Video URL
            </label>
            <input
              type="text"
              name="videoUrl"
              value={form.videoUrl}
              onChange={handleChange}
              placeholder="Paste YouTube link here"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Enter description"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
            />
          </div>

          <div className="md:col-span-2 flex items-center gap-3">
            <input
              id="active"
              type="checkbox"
              name="active"
              checked={form.active}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <label htmlFor="active" className="text-sm font-medium text-slate-700">
              Active
            </label>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-slate-900 px-6 py-3 font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              {saving ? "Saving..." : editingId ? "Update Tutorial" : "Add Tutorial"}
            </button>
          </div>
        </form>
      </div>

      <div className="overflow-hidden rounded-[28px] bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-900">All Tutorials</h3>
        </div>

        {loading ? (
          <div className="p-6 text-slate-500">Loading...</div>
        ) : items.length === 0 ? (
          <div className="p-6 text-slate-500">No tutorials found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Video URL
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Order
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item._id || index} className="border-t border-slate-100">
                    <td className="px-6 py-4 text-sm text-slate-700">
                      {item.title}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      <div className="max-w-[320px] truncate">{item.videoUrl}</div>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {item.order}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          item.active
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default TutorialsAdmin;