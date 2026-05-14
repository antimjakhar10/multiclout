import { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../../utils/api";

function StatsAdmin() {
  const token = localStorage.getItem("adminToken");
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  

  const [form, setForm] = useState({
    label: "",
    value: "",
    order: 0,
    active: true,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(`${API}/stats/admin/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        setStats(res.data.stats || []);
      } else {
        setStats([]);
        setError("Failed to fetch stats.");
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      setStats([]);
      setError(error?.response?.data?.message || "Failed to fetch stats.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      label: "",
      value: "",
      order: 0,
      active: true,
    });
    setEditingId(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.label.trim() || !form.value.trim()) {
      setError("Label and value are required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      if (editingId) {
        await axios.put(`${API}/stats/${editingId}`, form, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        await axios.post(`${API}/stats/add`, form, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      resetForm();
      fetchStats();
    } catch (error) {
      console.error("Failed to save stat:", error);
      setError(error?.response?.data?.message || "Failed to save stat.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setForm({
      label: item.label || "",
      value: item.value || "",
      order: item.order ?? 0,
      active: !!item.active,
    });
    setEditingId(item._id);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this stat?");
    if (!ok) return;

    try {
      setError("");
      await axios.delete(`${API}/stats/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchStats();
    } catch (error) {
      console.error("Failed to delete stat:", error);
      setError(error?.response?.data?.message || "Failed to delete stat.");
    }
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-[1400px] p-4 md:p-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm text-slate-600">
          Loading stats...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-6 p-4 md:p-6">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4 md:px-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#07111a] md:text-3xl">
                Hero Stats
              </h1>
              <p className="mt-2 text-sm text-slate-600 md:text-base">
                Manage hero section stat cards from here.
              </p>
            </div>

            {editingId ? (
              <button
                onClick={resetForm}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancel Edit
              </button>
            ) : null}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-4 p-5 md:grid-cols-2 md:p-6"
        >
          <input
            type="text"
            value={form.label}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, label: e.target.value }))
            }
            placeholder="Label"
            className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-[15px] text-[#07111a] outline-none transition focus:border-[#167a7a] focus:ring-2 focus:ring-[#167a7a]/10"
          />

          <input
            type="text"
            value={form.value}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, value: e.target.value }))
            }
            placeholder="Value"
            className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-[15px] text-[#07111a] outline-none transition focus:border-[#167a7a] focus:ring-2 focus:ring-[#167a7a]/10"
          />

          <input
            type="number"
            value={form.order}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                order: Number(e.target.value),
              }))
            }
            placeholder="Order"
            className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-[15px] text-[#07111a] outline-none transition focus:border-[#167a7a] focus:ring-2 focus:ring-[#167a7a]/10"
          />

          <select
            value={form.active ? "true" : "false"}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                active: e.target.value === "true",
              }))
            }
            className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-[15px] text-[#07111a] outline-none transition focus:border-[#167a7a] focus:ring-2 focus:ring-[#167a7a]/10"
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-gradient-to-r from-[#0b5c8e] via-[#167a7a] to-[#2e8b57] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:opacity-60"
            >
              {saving ? "Saving..." : editingId ? "Update Stat" : "Add Stat"}
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4 md:px-6">
          <h2 className="text-xl font-semibold text-[#07111a]">All Stats</h2>
        </div>

        <div className="p-5 md:p-6">
          {error ? (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          ) : null}

          {stats.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-slate-500">
              No stats found.
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50 text-left">
                    <tr className="border-b border-slate-200">
                      <th className="px-4 py-4 font-semibold text-[#07111a]">
                        Label
                      </th>
                      <th className="px-4 py-4 font-semibold text-[#07111a]">
                        Value
                      </th>
                      <th className="px-4 py-4 font-semibold text-[#07111a]">
                        Order
                      </th>
                      <th className="px-4 py-4 font-semibold text-[#07111a]">
                        Status
                      </th>
                      <th className="px-4 py-4 font-semibold text-[#07111a]">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200 bg-white">
                    {stats.map((item) => (
                      <tr key={item._id}>
                        <td className="px-4 py-4 text-slate-700">
                          {item.label}
                        </td>
                        <td className="px-4 py-4 text-slate-700">
                          {item.value}
                        </td>
                        <td className="px-4 py-4 text-slate-700">
                          {item.order}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              item.active
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {item.active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="inline-flex h-11 items-center justify-center rounded-xl bg-red-500 px-4 text-sm font-medium text-white transition hover:bg-red-600"
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StatsAdmin;