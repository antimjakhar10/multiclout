import { useEffect, useState } from "react";
import { API, getAuthHeaders } from "../../utils/api";

const emptyForm = {
  question: "",
  answer: "",
  order: 0,
  active: true,
};

function FaqsAdmin() {
  const [faqs, setFaqs] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const fetchFaqs = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API}/faqs`);

      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Failed to fetch FAQs");
      }

      setFaqs(data.faqs || []);
    } catch (error) {
      console.error("FAQ fetch error:", error);
      setMessage(error.message || "FAQs fetch nahi ho paaye");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "order"
          ? Number(value)
          : value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setMessage("");
  };

  const handleEdit = (faq) => {
    setForm({
      question: faq.question || "",
      answer: faq.answer || "",
      order: faq.order || 0,
      active: faq.active !== false,
    });

    setEditingId(faq._id);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.question.trim() || !form.answer.trim()) {
      setMessage("Question aur Answer dono required hain.");
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      const url = editingId
        ? `${API}/faqs/${editingId}`
        : `${API}/faqs/add`;

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message || "FAQ save nahi hua");
      }

      resetForm();
      fetchFaqs();
      setMessage(editingId ? "FAQ updated successfully." : "FAQ added successfully.");
    } catch (error) {
      console.error("FAQ save error:", error);
      setMessage(error.message || "FAQ save nahi hua");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this FAQ?");
    if (!ok) return;

    try {
      setMessage("");

      const res = await fetch(`${API}/faqs/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message || "FAQ delete nahi hua");
      }

      fetchFaqs();
      setMessage("FAQ deleted successfully.");
    } catch (error) {
      console.error("FAQ delete error:", error);
      setMessage(error.message || "FAQ delete nahi hua");
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">FAQs</h2>
            <p className="mt-1 text-sm text-slate-500">
              Add, update and manage website FAQs from here.
            </p>
          </div>

          {editingId ? (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
            >
              Cancel Edit
            </button>
          ) : null}
        </div>

        {message ? (
          <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
            {message}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Question
            </label>
            <input
              type="text"
              name="question"
              value={form.question}
              onChange={handleChange}
              placeholder="Enter question"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Answer
            </label>
            <textarea
              name="answer"
              value={form.answer}
              onChange={handleChange}
              rows={5}
              placeholder="Enter answer"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
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
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
            />
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-3 rounded-2xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={handleChange}
                className="h-4 w-4"
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
              {saving ? "Saving..." : editingId ? "Update FAQ" : "Add FAQ"}
            </button>
          </div>
        </form>
      </div>

      <div className="overflow-hidden rounded-[28px] bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-900">All FAQs</h3>
        </div>

        {loading ? (
          <div className="p-6 text-slate-500">Loading...</div>
        ) : faqs.length === 0 ? (
          <div className="p-6 text-slate-500">No FAQs found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Question
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
                {faqs.map((faq) => (
                  <tr key={faq._id} className="border-t border-slate-100">
                    <td className="px-6 py-4 text-sm font-medium text-slate-700">
                      {faq.question}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {faq.order ?? 0}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          faq.active
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {faq.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(faq)}
                          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(faq._id)}
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

export default FaqsAdmin;