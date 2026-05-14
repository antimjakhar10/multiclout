import { useEffect, useState } from "react";
import { API, API_HOST, getAdminToken } from "../../utils/api";

const createLesson = () => ({
  title: "",
  duration: "",
  type: "video",
  videoUrl: "",
});

const createSection = () => ({
  title: "",
  lecturesCount: "",
  duration: "",
  lessons: [createLesson()],
});

const emptyForm = {
  title: "",
  subtitle: "",
  instructor: "",
  rating: "",
  totalRatings: "",
  learners: "",
  tag: "",
  bestseller: false,
  price: "",
  oldPrice: "",
  category: "",
  subcategory: "",
  previewVideo: "",
  description: "",
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
  fullDescription: "",
  language: "English",
  lastUpdatedText: "",
  duration: "",
  level: "All Levels",
  offerText: "",
  moneyBackDays: "30",
  whatYouWillLearn: [""],
  requirements: [""],
  includes: [""],
  outcomes: [""],
  sections: [createSection()],
  order: "",
  active: true,
};

function CoursesAdmin() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const token = getAdminToken();

  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/courses/admin/all`, {
        headers: authHeaders,
      });
      const data = await res.json();
      setItems(data.courses || []);
    } catch (error) {
      console.error("Courses fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setImageFile(null);
    setEditingId(null);
    setExistingImage("");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const updateArrayField = (field, index, value) => {
    setForm((prev) => {
      const updated = [...prev[field]];
      updated[index] = value;
      return { ...prev, [field]: updated };
    });
  };

  const addArrayField = (field) => {
    setForm((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayField = (field, index) => {
    setForm((prev) => {
      const updated = prev[field].filter((_, i) => i !== index);
      return {
        ...prev,
        [field]: updated.length ? updated : [""],
      };
    });
  };

  const updateSectionField = (sectionIndex, field, value) => {
    setForm((prev) => {
      const updatedSections = [...prev.sections];
      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        [field]: value,
      };
      return {
        ...prev,
        sections: updatedSections,
      };
    });
  };

  const addSection = () => {
    setForm((prev) => ({
      ...prev,
      sections: [...prev.sections, createSection()],
    }));
  };

  const removeSection = (sectionIndex) => {
    setForm((prev) => {
      const updatedSections = prev.sections.filter(
        (_, i) => i !== sectionIndex,
      );
      return {
        ...prev,
        sections: updatedSections.length ? updatedSections : [createSection()],
      };
    });
  };

  const updateLessonField = (sectionIndex, lessonIndex, field, value) => {
    setForm((prev) => {
      const updatedSections = [...prev.sections];
      const updatedLessons = [...updatedSections[sectionIndex].lessons];

      updatedLessons[lessonIndex] = {
        ...updatedLessons[lessonIndex],
        [field]: value,
      };

      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        lessons: updatedLessons,
      };

      return {
        ...prev,
        sections: updatedSections,
      };
    });
  };

  const addLesson = (sectionIndex) => {
    setForm((prev) => {
      const updatedSections = [...prev.sections];
      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        lessons: [...updatedSections[sectionIndex].lessons, createLesson()],
      };

      return {
        ...prev,
        sections: updatedSections,
      };
    });
  };

  const removeLesson = (sectionIndex, lessonIndex) => {
    setForm((prev) => {
      const updatedSections = [...prev.sections];
      const updatedLessons = updatedSections[sectionIndex].lessons.filter(
        (_, i) => i !== lessonIndex,
      );

      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        lessons: updatedLessons.length ? updatedLessons : [createLesson()],
      };

      return {
        ...prev,
        sections: updatedSections,
      };
    });
  };

  const handleEdit = (item) => {
    setForm({
      title: item.title || "",
      subtitle: item.subtitle || "",
      instructor: item.instructor || "",
      rating: item.rating ?? "",
      totalRatings: item.totalRatings ?? "",
      learners: item.learners ?? "",
      tag: item.tag || "",
      bestseller: item.bestseller ?? false,
      price: item.price ?? "",
      oldPrice: item.oldPrice ?? "",
      category: item.category || "",
      subcategory: item.subcategory || "",
      previewVideo: item.previewVideo || "",
      description: item.description || "",
      seoTitle: item.seoTitle || "",
      seoDescription: item.seoDescription || "",
      seoKeywords: item.seoKeywords || "",
      fullDescription: item.fullDescription || "",
      language: item.language || "English",
      lastUpdatedText: item.lastUpdatedText || "",
      duration: item.duration || "",
      level: item.level || "All Levels",
      offerText: item.offerText || "",
      moneyBackDays: item.moneyBackDays ?? 30,
      whatYouWillLearn:
        Array.isArray(item.whatYouWillLearn) && item.whatYouWillLearn.length
          ? item.whatYouWillLearn
          : [""],
      requirements:
        Array.isArray(item.requirements) && item.requirements.length
          ? item.requirements
          : [""],
      includes:
        Array.isArray(item.includes) && item.includes.length
          ? item.includes
          : [""],
      outcomes:
        Array.isArray(item.outcomes) && item.outcomes.length
          ? item.outcomes
          : [""],
      sections:
        Array.isArray(item.sections) && item.sections.length
          ? item.sections.map((section) => ({
              title: section.title || "",
              lecturesCount: section.lecturesCount || "",
              duration: section.duration || "",
              lessons:
                Array.isArray(section.lessons) && section.lessons.length
                  ? section.lessons.map((lesson) => ({
                      title: lesson.title || "",
                      duration: lesson.duration || "",
                      type: lesson.type || "video",
                      videoUrl: lesson.videoUrl || "",
                    }))
                  : [createLesson()],
            }))
          : [createSection()],
      order: item.order ?? "",
      active: item.active ?? true,
    });

    setExistingImage(item.image || "");
    setImageFile(null);
    setEditingId(item._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this course?");
    if (!ok) return;

    try {
      const res = await fetch(`${API}/courses/${id}`, {
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

  const normalizeArray = (arr) =>
    arr.map((item) => String(item || "").trim()).filter(Boolean);

  const normalizeSections = (sections) =>
    sections
      .map((section) => ({
        title: String(section.title || "").trim(),
        lecturesCount: String(section.lecturesCount || "").trim(),
        duration: String(section.duration || "").trim(),
        lessons: (section.lessons || [])
          .map((lesson) => ({
            title: String(lesson.title || "").trim(),
            duration: String(lesson.duration || "").trim(),
            type: String(lesson.type || "video").trim() || "video",
            videoUrl: String(lesson.videoUrl || "").trim(),
          }))
          .filter((lesson) => lesson.title),
      }))
      .filter((section) => section.title);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editingId && !imageFile) {
      alert("Please upload a course image");
      return;
    }

    try {
      setSaving(true);

      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("subtitle", form.subtitle);
      fd.append("instructor", form.instructor);
      fd.append("rating", form.rating || 0);
      fd.append("totalRatings", form.totalRatings || 0);
      fd.append("learners", form.learners || 0);
      fd.append("tag", form.tag);
      fd.append("bestseller", form.bestseller);
      fd.append("price", form.price);
      fd.append("oldPrice", form.oldPrice || 0);
      fd.append("category", form.category);
      fd.append("subcategory", form.subcategory);
      fd.append("previewVideo", form.previewVideo);
      fd.append("description", form.description);
      fd.append("seoTitle", form.seoTitle);
      fd.append("seoDescription", form.seoDescription);
      fd.append("seoKeywords", form.seoKeywords);
      fd.append("fullDescription", form.fullDescription);
      fd.append("language", form.language);
      fd.append("lastUpdatedText", form.lastUpdatedText);
      fd.append("duration", form.duration);
      fd.append("level", form.level);
      fd.append("offerText", form.offerText);
      fd.append("moneyBackDays", form.moneyBackDays || 30);
      fd.append("order", form.order || 0);
      fd.append("active", form.active);

      fd.append(
        "whatYouWillLearn",
        normalizeArray(form.whatYouWillLearn).join("\n"),
      );
      fd.append("requirements", normalizeArray(form.requirements).join("\n"));
      fd.append("includes", normalizeArray(form.includes).join("\n"));
      fd.append("outcomes", normalizeArray(form.outcomes).join("\n"));

      const sectionsText = normalizeSections(form.sections)
        .map((section) => {
          const sectionLine = [
            section.title,
            section.lecturesCount,
            section.duration,
          ].join(" | ");

          const lessonLines = section.lessons.map((lesson) =>
            [lesson.title, lesson.duration, lesson.type, lesson.videoUrl].join(
              " | ",
            ),
          );

          return [sectionLine, ...lessonLines].join("\n");
        })
        .join("\n\n");

      fd.append("sectionsText", sectionsText);

      if (imageFile) {
        fd.append("image", imageFile);
      }

      const url = editingId
        ? `${API}/courses/${editingId}`
        : `${API}/courses/add`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: authHeaders,
        body: fd,
      });

      const data = await res.json();

      if (!data.success && res.status >= 400) {
  throw new Error(data.message || "Save failed");
}

alert(editingId ? "Course updated successfully" : "Course added successfully");

resetForm();
fetchItems();
    } catch (error) {
      alert(error.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const renderListEditor = (title, field, placeholder) => (
    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h4 className="text-base font-semibold text-slate-900">{title}</h4>
        <button
          type="button"
          onClick={() => addArrayField(field)}
          className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-medium text-white"
        >
          + Add Item
        </button>
      </div>

      <div className="space-y-3">
        {form[field].map((item, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => updateArrayField(field, index, e.target.value)}
              placeholder={placeholder}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-slate-900"
            />
            <button
              type="button"
              onClick={() => removeArrayField(field, index)}
              className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Courses</h2>
            <p className="mt-1 text-sm text-slate-500">
              Add, update and manage full course details from here.
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-[24px] border border-slate-200 p-5">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">
              Basic Information
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter title"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Subtitle
                </label>
                <input
                  type="text"
                  name="subtitle"
                  value={form.subtitle}
                  onChange={handleChange}
                  placeholder="Short subtitle"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Instructor
                </label>
                <input
                  type="text"
                  name="instructor"
                  value={form.instructor}
                  onChange={handleChange}
                  placeholder="Enter instructor"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="Enter category"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Subcategory
                </label>
                <input
                  type="text"
                  name="subcategory"
                  value={form.subcategory}
                  onChange={handleChange}
                  placeholder="Enter subcategory"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Tag
                </label>
                <input
                  type="text"
                  name="tag"
                  value={form.tag}
                  onChange={handleChange}
                  placeholder="Popular / Trending / Bestseller"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Rating
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="rating"
                  value={form.rating}
                  onChange={handleChange}
                  placeholder="4.8"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Total Ratings
                </label>
                <input
                  type="number"
                  name="totalRatings"
                  value={form.totalRatings}
                  onChange={handleChange}
                  placeholder="12450"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Learners
                </label>
                <input
                  type="number"
                  name="learners"
                  value={form.learners}
                  onChange={handleChange}
                  placeholder="64892"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                />
              </div>

              <div className="flex items-center gap-3 pt-8">
                <input
                  id="bestseller"
                  type="checkbox"
                  name="bestseller"
                  checked={form.bestseller}
                  onChange={handleChange}
                  className="h-4 w-4"
                />
                <label
                  htmlFor="bestseller"
                  className="text-sm font-medium text-slate-700"
                >
                  Bestseller Badge
                </label>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 p-5">
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
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
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
                  placeholder="keyword1, keyword2, keyword3"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
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
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                />
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 p-5">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">
              Pricing & Media
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="499"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Old Price
                </label>
                <input
                  type="number"
                  name="oldPrice"
                  value={form.oldPrice}
                  onChange={handleChange}
                  placeholder="1999"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Offer Text
                </label>
                <input
                  type="text"
                  name="offerText"
                  value={form.offerText}
                  onChange={handleChange}
                  placeholder="71% off! Offer ends in 2 days"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Money Back Days
                </label>
                <input
                  type="number"
                  name="moneyBackDays"
                  value={form.moneyBackDays}
                  onChange={handleChange}
                  placeholder="30"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Preview Video URL
                </label>
                <input
                  type="text"
                  name="previewVideo"
                  value={form.previewVideo}
                  onChange={handleChange}
                  placeholder="YouTube / Vimeo / direct video link"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Course Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                />
                {editingId && existingImage ? (
                  <p className="mt-2 text-xs text-slate-500">
                    New image upload nahi karegi to old image same rahegi.
                  </p>
                ) : null}
              </div>

              {editingId && existingImage ? (
                <div className="md:col-span-2">
                  <p className="mb-2 text-sm font-medium text-slate-700">
                    Existing Image Preview
                  </p>
                  <img
                    src={
  existingImage?.startsWith("http")
    ? existingImage
    : `${API_HOST}${existingImage}`
}
                    alt="Course Preview"
                    className="h-[180px] w-[280px] rounded-2xl border border-slate-200 object-cover"
                  />
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 p-5">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">
              Additional Details
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Language
                </label>
                <input
                  type="text"
                  name="language"
                  value={form.language}
                  onChange={handleChange}
                  placeholder="English"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Last Updated Text
                </label>
                <input
                  type="text"
                  name="lastUpdatedText"
                  value={form.lastUpdatedText}
                  onChange={handleChange}
                  placeholder="11/2025"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Duration
                </label>
                <input
                  type="text"
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  placeholder="22h 15m"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Level
                </label>
                <input
                  type="text"
                  name="level"
                  value={form.level}
                  onChange={handleChange}
                  placeholder="All Levels"
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
                  placeholder="0"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                />
              </div>

              <div className="flex items-center gap-3 pt-8">
                <input
                  id="active"
                  type="checkbox"
                  name="active"
                  checked={form.active}
                  onChange={handleChange}
                  className="h-4 w-4"
                />
                <label
                  htmlFor="active"
                  className="text-sm font-medium text-slate-700"
                >
                  Active
                </label>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Short Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Short intro description"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Full Description
                </label>
                <textarea
                  name="fullDescription"
                  value={form.fullDescription}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Long course description"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {renderListEditor(
              "What You'll Learn",
              "whatYouWillLearn",
              "Enter learning point",
            )}
            {renderListEditor(
              "Requirements",
              "requirements",
              "Enter requirement",
            )}
            {renderListEditor(
              "This Course Includes",
              "includes",
              "Enter include item",
            )}
            {renderListEditor("Outcomes", "outcomes", "Enter outcome")}
          </div>

          <div className="rounded-[24px] border border-slate-200 p-5">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Course Sections
              </h3>
              <button
                type="button"
                onClick={addSection}
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
              >
                + Add Section
              </button>
            </div>

            <div className="space-y-5">
              {form.sections.map((section, sectionIndex) => (
                <div
                  key={sectionIndex}
                  className="rounded-[22px] border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h4 className="text-base font-semibold text-slate-900">
                      Section {sectionIndex + 1}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeSection(sectionIndex)}
                      className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600"
                    >
                      Remove Section
                    </button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Section Title
                      </label>
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) =>
                          updateSectionField(
                            sectionIndex,
                            "title",
                            e.target.value,
                          )
                        }
                        placeholder="M1: Introduction to Marketing"
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-slate-900"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Lectures Count
                      </label>
                      <input
                        type="text"
                        value={section.lecturesCount}
                        onChange={(e) =>
                          updateSectionField(
                            sectionIndex,
                            "lecturesCount",
                            e.target.value,
                          )
                        }
                        placeholder="5 lectures"
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-slate-900"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Duration
                      </label>
                      <input
                        type="text"
                        value={section.duration}
                        onChange={(e) =>
                          updateSectionField(
                            sectionIndex,
                            "duration",
                            e.target.value,
                          )
                        }
                        placeholder="45 min"
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-slate-900"
                      />
                    </div>
                  </div>

                  <div className="mt-5 rounded-[20px] border border-slate-200 bg-white p-4">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <h5 className="text-sm font-semibold text-slate-900">
                        Lessons
                      </h5>
                      <button
                        type="button"
                        onClick={() => addLesson(sectionIndex)}
                        className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-medium text-white"
                      >
                        + Add Lesson
                      </button>
                    </div>

                    <div className="space-y-4">
                      {section.lessons.map((lesson, lessonIndex) => (
                        <div
                          key={lessonIndex}
                          className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 md:grid-cols-2"
                        >
                          <input
                            type="text"
                            value={lesson.title}
                            onChange={(e) =>
                              updateLessonField(
                                sectionIndex,
                                lessonIndex,
                                "title",
                                e.target.value,
                              )
                            }
                            placeholder="Lesson title"
                            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-slate-900"
                          />

                          <input
                            type="text"
                            value={lesson.duration}
                            onChange={(e) =>
                              updateLessonField(
                                sectionIndex,
                                lessonIndex,
                                "duration",
                                e.target.value,
                              )
                            }
                            placeholder="03:12 / 2 pages"
                            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-slate-900"
                          />

                          <select
                            value={lesson.type}
                            onChange={(e) =>
                              updateLessonField(
                                sectionIndex,
                                lessonIndex,
                                "type",
                                e.target.value,
                              )
                            }
                            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-slate-900"
                          >
                            <option value="video">Video</option>
                            <option value="resource">Resource</option>
                            <option value="article">Article</option>
                          </select>

                          <input
                            type="text"
                            value={lesson.videoUrl}
                            onChange={(e) =>
                              updateLessonField(
                                sectionIndex,
                                lessonIndex,
                                "videoUrl",
                                e.target.value,
                              )
                            }
                            placeholder="Lesson video URL (optional)"
                            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-slate-900"
                          />

                          <div className="md:col-span-2">
                            <button
                              type="button"
                              onClick={() =>
                                removeLesson(sectionIndex, lessonIndex)
                              }
                              className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-slate-900 px-6 py-3 font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Course"
                  : "Add Course"}
            </button>
          </div>
        </form>
      </div>

      <div className="overflow-hidden rounded-[28px] bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-900">All Courses</h3>
        </div>

        {loading ? (
          <div className="p-6 text-slate-500">Loading...</div>
        ) : items.length === 0 ? (
          <div className="p-6 text-slate-500">No courses found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Image
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Slug
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr
                    key={item._id || index}
                    className="border-t border-slate-100"
                  >
                    <td className="px-6 py-4">
                      {item.image ? (
                        <img
                          src={
  item.image?.startsWith("http")
    ? item.image
    : `${API_HOST}${item.image}`
}
                          alt={item.title}
                          className="h-[72px] w-[110px] rounded-xl border border-slate-200 object-cover"
                        />
                      ) : (
                        "-"
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {item.title}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {item.category}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      ₹{item.price}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          item.active
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {item.active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {item.slug || "-"}
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

export default CoursesAdmin;
