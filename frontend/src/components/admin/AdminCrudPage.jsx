import { useEffect, useMemo, useState } from "react";
import { API, getAuthHeaders } from "../../utils/api";
import { getImageUrl } from "../../utils/videoHelpers";

const emptyValueByField = (type) => {
  return "";
};

function AdminCrudPage({
  title,
  endpoint,
  fields = [],
  listKey = null,
  itemLabel = "Item",
}) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fileFields = useMemo(
    () => fields.filter((field) => field.type === "file").map((field) => field.name),
    [fields]
  );

  const API_BASE = API.endsWith("/api") ? API.replace("/api", "") : API;

  useEffect(() => {
    const initialForm = {};
    fields.forEach((field) => {
      initialForm[field.name] = emptyValueByField(field.type);
    });
    setForm(initialForm);
    fetchItems();
  }, [endpoint]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}${endpoint}`);
      const data = await res.json();

      let extracted = [];
      if (Array.isArray(data)) extracted = data;
      else if (listKey && Array.isArray(data[listKey])) extracted = data[listKey];
      else if (Array.isArray(data.data)) extracted = data.data;
      else if (Array.isArray(data.items)) extracted = data.items;

      setItems(extracted);
    } catch (error) {
      console.error(`${title} fetch error:`, error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    const initialForm = {};
    fields.forEach((field) => {
      initialForm[field.name] = emptyValueByField(field.type);
    });
    setForm(initialForm);
    setEditingId(null);
  };

  const handleChange = (e, field) => {
    const { name, value, files } = e.target;

    if (field.type === "file") {
      setForm((prev) => ({
        ...prev,
        [name]: files?.[0] || "",
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = (item) => {
    const updated = {};
    fields.forEach((field) => {
      if (field.type === "file") {
        updated[field.name] = item[field.name] || "";
      } else {
        updated[field.name] = item[field.name] ?? "";
      }
    });

    setForm(updated);
    setEditingId(item._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this item?");
    if (!ok) return;

    try {
      const res = await fetch(`${API}${endpoint}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editingId
        ? `${API}${endpoint}/${editingId}`
        : `${API}${endpoint}`;

      const method = editingId ? "PUT" : "POST";

      const hasFileField = fields.some((field) => field.type === "file");

      let options = { method };

      if (hasFileField) {
        const fd = new FormData();

        fields.forEach((field) => {
          const value = form[field.name];

          if (field.type === "file") {
            if (value instanceof File) {
              fd.append(field.name, value);
            }
          } else {
            fd.append(field.name, value || "");
          }
        });

        options.body = fd;
        options.headers = getAuthHeaders(true);
      } else {
        options.headers = getAuthHeaders();
        options.body = JSON.stringify(form);
      }

      const res = await fetch(url, options);
const text = await res.text();

let data;
try {
  data = JSON.parse(text);
} catch (error) {
  console.error("Non-JSON response:", text);
  throw new Error("Backend se JSON ke badle HTML/error page aa rahi hai.");
}

      if (!data.success && res.status >= 400) {
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

  const displayFields = fields.filter((field) => field.type !== "textarea").slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
            <p className="mt-1 text-sm text-slate-500">
              Add, update and manage {title.toLowerCase()} from here.
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
          {fields.map((field) => (
            <div
              key={field.name}
              className={field.type === "textarea" ? "md:col-span-2" : ""}
            >
              <label className="mb-2 block text-sm font-medium text-slate-700">
                {field.label}
              </label>

              {field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  value={form[field.name] || ""}
                  onChange={(e) => handleChange(e, field)}
                  rows={5}
                  placeholder={field.placeholder || `Enter ${field.label}`}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                />
              ) : field.type === "file" ? (
                <div>
                  <input
                    type="file"
                    name={field.name}
                    accept="image/*"
                    onChange={(e) => handleChange(e, field)}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                  />

                  {form[field.name] ? (
                    <div className="mt-3">
                      <img
                        src={
                          form[field.name] instanceof File
                            ? URL.createObjectURL(form[field.name])
                            : getImageUrl(form[field.name])
                        }
                        alt="Preview"
                        className="h-24 w-24 rounded-2xl object-cover border border-slate-200"
                      />
                    </div>
                  ) : null}
                </div>
              ) : (
                <input
                  type={field.type || "text"}
                  name={field.name}
                  value={form[field.name] || ""}
                  onChange={(e) => handleChange(e, field)}
                  placeholder={field.placeholder || `Enter ${field.label}`}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                />
              )}
            </div>
          ))}

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-slate-900 px-6 py-3 font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : editingId
                ? `Update ${itemLabel}`
                : `Add ${itemLabel}`}
            </button>
          </div>
        </form>
      </div>

      <div className="overflow-hidden rounded-[28px] bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-900">All {title}</h3>
        </div>

        {loading ? (
          <div className="p-6 text-slate-500">Loading...</div>
        ) : items.length === 0 ? (
          <div className="p-6 text-slate-500">No data found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr>
                  {displayFields.map((field) => (
                    <th
                      key={field.name}
                      className="px-6 py-4 text-left text-sm font-semibold text-slate-700"
                    >
                      {field.label}
                    </th>
                  ))}
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item._id || index} className="border-t border-slate-100">
                    {displayFields.map((field) => (
                      <td
                        key={field.name}
                        className="px-6 py-4 text-sm text-slate-600"
                      >
                        {field.type === "file" ? (
                          item[field.name] ? (
                            <img
                              src={getImageUrl(item[field.name])}
                              alt={item.name || "Item"}
                              className="h-14 w-14 rounded-xl object-cover border border-slate-200"
                            />
                          ) : (
                            "-"
                          )
                        ) : (
                          String(item[field.name] ?? "").slice(0, 80) || "-"
                        )}
                      </td>
                    ))}

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

export default AdminCrudPage;