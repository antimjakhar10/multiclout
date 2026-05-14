import { useEffect, useMemo, useState } from "react";
import { API, getAuthHeaders } from "../../utils/api";
import { getImageUrl } from "../../utils/videoHelpers";

const initialForm = {
  name: "",
  city: "",
  text: "",
  rating: "5",
  image: null,
  active: true,
  order: "0",
};

function TestimonialsAdmin() {
  const [testimonials, setTestimonials] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API}/testimonials/admin/all`, {
        headers: getAuthHeaders(),
      });

      const text = await res.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch (error) {
        console.error("Testimonials fetch non-json:", text);
        throw new Error("Testimonials fetch failed");
      }

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch testimonials");
      }

      setTestimonials(data.testimonials || []);
    } catch (error) {
      alert(error.message || "Failed to fetch testimonials");
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
    const { name, value, type, files, checked } = e.target;

    if (type === "file") {
      setForm((prev) => ({
        ...prev,
        [name]: files?.[0] || null,
      }));
      return;
    }

    if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        [name]: checked,
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({
      name: item.name || "",
      city: item.city || "",
      text: item.text || "",
      rating: String(item.rating ?? 5),
      image: null,
      active: item.active ?? true,
      order: String(item.order ?? 0),
    });
    setExistingImage(item.image || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this testimonial?");
    if (!ok) return;

    try {
      const res = await fetch(`${API}/testimonials/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      const text = await res.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch (error) {
        console.error("Delete testimonial non-json:", text);
        throw new Error("Delete failed");
      }

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Delete failed");
      }

      fetchTestimonials();
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
      fd.append("city", form.city || "");
      fd.append("text", form.text || "");
      fd.append("rating", form.rating || "5");
      fd.append("active", form.active ? "true" : "false");
      fd.append("order", form.order || "0");

      if (form.image instanceof File) {
        fd.append("image", form.image);
      }

      const url = editingId
        ? `${API}/testimonials/${editingId}`
        : `${API}/testimonials/add`;

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
        console.error("Save testimonial non-json:", text);
        throw new Error("Backend error aa rahi hai");
      }

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Save failed");
      }

      resetForm();
      fetchTestimonials();
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
            <h2 className="text-2xl font-bold text-slate-900">Testimonials</h2>
            <p className="mt-1 text-sm text-slate-500">
              Add, update and manage testimonials from here.
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
              City / Location
            </label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="e.g. Delhi"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Testimonial Text
            </label>
            <textarea
              name="text"
              value={form.text}
              onChange={handleChange}
              rows={5}
              placeholder="Enter testimonial text"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Rating
            </label>
            <input
              type="number"
              min="1"
              max="5"
              step="1"
              name="rating"
              value={form.rating}
              onChange={handleChange}
              placeholder="5"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Display Order
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
              Image
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
                  alt="Testimonial Preview"
                  className="h-24 w-24 rounded-2xl border border-slate-200 object-cover"
                />
              </div>
            ) : null}
          </div>

          <div className="md:col-span-2">
            <label className="inline-flex items-center gap-3 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={handleChange}
              />
              Active
            </label>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-slate-900 px-6 py-3 font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Testimonial"
                : "Add Testimonial"}
            </button>
          </div>
        </form>
      </div>

      <div className="overflow-hidden rounded-[28px] bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-900">All Testimonials</h3>
        </div>

        {loading ? (
          <div className="p-6 text-slate-500">Loading...</div>
        ) : testimonials.length === 0 ? (
          <div className="p-6 text-slate-500">No testimonials found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">City</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Rating</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Image</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Text</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {testimonials.map((item) => {
                  const image = getImageUrl(item.image);

                  return (
                    <tr key={item._id} className="border-t border-slate-100">
                      <td className="px-6 py-4 text-sm text-slate-600">{item.name || "-"}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{item.city || "-"}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{item.rating || "-"}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {image ? (
                          <img
                            src={image}
                            alt={item.name}
                            className="h-14 w-14 rounded-xl border border-slate-200 object-cover"
                          />
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 max-w-[320px]">
                        <span className="line-clamp-3">{item.text || "-"}</span>
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

export default TestimonialsAdmin;