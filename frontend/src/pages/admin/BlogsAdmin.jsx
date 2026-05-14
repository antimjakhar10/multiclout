import { useEffect, useMemo, useState } from "react";
import { API, getAdminToken } from "../../utils/api";
import { ImagePlus, Pencil, Trash2, Star, Eye, FileText } from "lucide-react";

const initialForm = {
  title: "",
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
  excerpt: "",
  content: "",
  category: "",
  author: "",
  tags: "",
  featured: false,
  status: "published",
  publishedAt: "",
  image: null,
};

function BlogsAdmin() {
  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    fetchBlogs();
  }, []);

  const stats = useMemo(() => {
    return {
      total: blogs.length,
      published: blogs.filter((b) => b.status === "published").length,
      drafts: blogs.filter((b) => b.status === "draft").length,
      featured: blogs.filter((b) => b.featured).length,
    };
  }, [blogs]);

  const fetchBlogs = async () => {
    try {
      setFetching(true);
      const res = await fetch(`${API}/blogs/admin/all`, {
        headers: {
          Authorization: `Bearer ${getAdminToken()}`,
        },
      });
      const data = await res.json();

      if (data.success) {
        setBlogs(data.blogs || []);
      } else {
        alert(data.message || "Failed to fetch blogs");
      }
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
      alert("Failed to fetch blogs");
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      const file = files?.[0] || null;
      setForm((prev) => ({
        ...prev,
        [name]: file,
      }));

      if (file) {
        setPreview(URL.createObjectURL(file));
      }
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setPreview("");
  };

  const handleEdit = (blog) => {
    setEditingId(blog._id);
    setForm({
      title: blog.title || "",
      seoTitle: blog.seoTitle || "",
      seoDescription: blog.seoDescription || "",
      seoKeywords: blog.seoKeywords || "",
      excerpt: blog.excerpt || "",
      content: blog.content || "",
      category: blog.category || "",
      author: blog.author || "",
      tags: blog.tags?.join(", ") || "",
      featured: blog.featured || false,
      status: blog.status || "published",
      publishedAt: blog.publishedAt
        ? new Date(blog.publishedAt).toISOString().slice(0, 16)
        : "",
      image: null,
    });
    setPreview(blog.image || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("seoTitle", form.seoTitle);
      formData.append("seoDescription", form.seoDescription);
      formData.append("seoKeywords", form.seoKeywords);
      formData.append("excerpt", form.excerpt);
      formData.append("content", form.content);
      formData.append("category", form.category);
      formData.append("author", form.author);
      formData.append("tags", form.tags);
      formData.append("featured", form.featured);
      formData.append("status", form.status);
      if (form.publishedAt) formData.append("publishedAt", form.publishedAt);
      if (form.image) formData.append("image", form.image);

      const url = editingId
        ? `${API}/blogs/admin/update/${editingId}`
        : `${API}/blogs/admin/add`;

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${getAdminToken()}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        alert(
          editingId ? "Blog updated successfully" : "Blog added successfully",
        );
        resetForm();
        fetchBlogs();
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Failed to save blog:", error);
      alert("Failed to save blog");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this blog?");
    if (!ok) return;

    try {
      const res = await fetch(`${API}/blogs/admin/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getAdminToken()}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        alert("Blog deleted successfully");
        fetchBlogs();
      } else {
        alert(data.message || "Delete failed");
      }
    } catch (error) {
      console.error("Failed to delete blog:", error);
      alert("Failed to delete blog");
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total Blogs</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">
            {stats.total}
          </h3>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Published</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">
            {stats.published}
          </h3>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Drafts</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">
            {stats.drafts}
          </h3>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Featured</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">
            {stats.featured}
          </h3>
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {editingId ? "Edit Blog" : "Create New Blog"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Add professional blog posts and manage them from one place.
            </p>
          </div>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]"
        >
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Blog Title
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="Enter blog title"
                className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Excerpt
              </label>
              <textarea
                name="excerpt"
                value={form.excerpt}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Write a short summary for the blog card"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
              />
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">
                SEO Settings
              </h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    SEO Title
                  </label>
                  <input
                    type="text"
                    name="seoTitle"
                    value={form.seoTitle}
                    onChange={handleChange}
                    placeholder="SEO title"
                    className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-slate-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    SEO Keywords
                  </label>
                  <input
                    type="text"
                    name="seoKeywords"
                    value={form.seoKeywords}
                    onChange={handleChange}
                    placeholder="keyword1, keyword2"
                    className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-slate-400"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    SEO Description
                  </label>
                  <textarea
                    name="seoDescription"
                    value={form.seoDescription}
                    onChange={handleChange}
                    rows="3"
                    placeholder="SEO description"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="Business, Growth, Learning"
                  className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Author
                </label>
                <input
                  type="text"
                  name="author"
                  value={form.author}
                  onChange={handleChange}
                  placeholder="Multiclout Team"
                  className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-slate-400"
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  placeholder="learning, strategy, growth"
                  className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Publish Date
                </label>
                <input
                  type="datetime-local"
                  name="publishedAt"
                  value={form.publishedAt}
                  onChange={handleChange}
                  className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-slate-400"
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-slate-400"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <div className="flex items-end">
                <label className="flex h-12 w-full items-center gap-3 rounded-2xl border border-slate-200 px-4 text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={form.featured}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                  Mark as featured blog
                </label>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Blog Content
              </label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                required
                rows="14"
                placeholder="Write the full blog content here..."
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
              />
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
              <label className="mb-3 block text-sm font-medium text-slate-700">
                Featured Image
              </label>

              <label className="flex min-h-[240px] cursor-pointer flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-300 bg-white px-4 py-6 text-center transition hover:border-slate-400">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-[220px] w-full rounded-[18px] object-cover"
                  />
                ) : (
                  <>
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                      <ImagePlus size={24} className="text-slate-500" />
                    </div>
                    <p className="mt-4 text-sm font-semibold text-slate-700">
                      Upload blog cover image
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Recommended: landscape image for best blog card look
                    </p>
                  </>
                )}

                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />
              </label>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-white p-5">
              <h3 className="text-lg font-semibold text-slate-900">
                Publishing Tips
              </h3>
              <div className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
                <p>• Title clear aur professional rakho.</p>
                <p>• Excerpt 2-3 lines ka rakho taaki cards pe achha lage.</p>
                <p>• Tags comma separated likho.</p>
                <p>• Featured sirf important post ko banao.</p>
                <p>• Draft mode me save karke baad me publish kar sakti ho.</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              {loading
                ? "Saving..."
                : editingId
                  ? "Update Blog"
                  : "Publish Blog"}
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">All Blogs</h2>
            <p className="mt-1 text-sm text-slate-500">
              Manage published, draft and featured articles.
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-5">
          {fetching ? (
            <p className="text-slate-500">Loading blogs...</p>
          ) : blogs.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
              <FileText className="mx-auto text-slate-400" size={34} />
              <h3 className="mt-4 text-xl font-semibold text-slate-900">
                No blogs added yet
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Create your first blog from the form above.
              </p>
            </div>
          ) : (
            blogs.map((blog) => (
              <div
                key={blog._id}
                className="flex flex-col gap-5 rounded-[24px] border border-slate-200 p-4 md:flex-row md:items-start md:justify-between md:p-5"
              >
                <div className="flex flex-1 gap-4">
                  <img
                    src={
                      blog.image
                        ? blog.image.startsWith("http")
                          ? blog.image
                          : `${API}${blog.image}`.replace(
                              "/api/uploads",
                              "/uploads",
                            )
                        : "https://via.placeholder.com/300x200?text=No+Image"
                    }
                    alt={blog.title}
                    className="h-24 w-28 rounded-2xl object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {blog.title}
                      </h3>

                      {blog.featured && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                          <Star size={12} />
                          Featured
                        </span>
                      )}

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          blog.status === "published"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {blog.status}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                      {blog.category || "General"} •{" "}
                      {blog.author || "Multiclout Team"} •{" "}
                      {new Date(
                        blog.publishedAt || blog.createdAt,
                      ).toLocaleDateString()}
                    </p>

                    <p className="mt-3 line-clamp-2 text-sm leading-7 text-slate-600">
                      {blog.excerpt}
                    </p>

                    {blog.tags?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {blog.tags.slice(0, 4).map((tag, index) => (
                          <span
                            key={index}
                            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 md:justify-end">
                  <button
                    onClick={() => window.open(`/blog/${blog.slug}`, "_blank")}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <Eye size={16} />
                    View
                  </button>

                  <button
                    onClick={() => handleEdit(blog)}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default BlogsAdmin;
