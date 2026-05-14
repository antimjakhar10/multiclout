import { useEffect, useState } from "react";
import { API, getAuthHeaders } from "../../utils/api";

const initialForm = {
  title: "",
  desc: "",
  icon: "",
  order: "",
};

function ReasonsAdmin() {
  const [reasons, setReasons] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchReasons();
  }, []);

  const fetchReasons = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API}/reasons/admin/all`, {
        headers: getAuthHeaders(),
      });

      const text = await res.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch (error) {
        console.error("Reasons fetch non-json:", text);
        throw new Error("Reasons fetch failed");
      }

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch reasons");
      }

      setReasons(data.reasons || []);
    } catch (error) {
      alert(error.message || "Failed to fetch reasons");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = (reason) => {
    setEditingId(reason._id);
    setForm({
      title: reason.title || "",
      desc: reason.desc || "",
      icon: reason.icon || "",
      order: String(reason.order ?? ""),
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this reason?");
    if (!ok) return;

    try {
      const res = await fetch(`${API}/reasons/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      const text = await res.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch (error) {
        console.error("Reason delete non-json:", text);
        throw new Error("Delete failed");
      }

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Delete failed");
      }

      fetchReasons();
    } catch (error) {
      alert(error.message || "Delete failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editingId
        ? `${API}/reasons/${editingId}`
        : `${API}/reasons/add`;

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: form.title,
          desc: form.desc,
          icon: form.icon,
          order: Number(form.order || 0),
        }),
      });

      const text = await res.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch (error) {
        console.error("Reason save non-json:", text);
        throw new Error("Backend error aa rahi hai");
      }

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Save failed");
      }

      resetForm();
      fetchReasons();
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
            <h2 className="text-2xl font-bold text-slate-900">Reasons</h2>
            <p className="mt-1 text-sm text-slate-500">
              Add, update and manage reasons from here.
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
              placeholder="Enter Title"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Icon
            </label>
            <input
              type="text"
              name="icon"
              value={form.icon}
              onChange={handleChange}
              placeholder="e.g. trending / mobile / award / star"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              name="desc"
              value={form.desc}
              onChange={handleChange}
              rows={5}
              placeholder="Enter Description"
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
              placeholder="e.g. 0"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-slate-900 px-6 py-3 font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              {saving ? "Saving..." : editingId ? "Update Reason" : "Add Reason"}
            </button>
          </div>
        </form>
      </div>

      <div className="overflow-hidden rounded-[28px] bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-900">All Reasons</h3>
        </div>

        {loading ? (
          <div className="p-6 text-slate-500">Loading...</div>
        ) : reasons.length === 0 ? (
          <div className="p-6 text-slate-500">No reasons found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Icon
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Order
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {reasons.map((reason) => (
                  <tr key={reason._id} className="border-t border-slate-100">
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {reason.title || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {String(reason.desc || "-").slice(0, 120)}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {reason.icon || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {reason.order ?? 0}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(reason)}
                          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(reason._id)}
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

export default ReasonsAdmin;