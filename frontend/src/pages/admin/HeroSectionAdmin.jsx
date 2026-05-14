import { useEffect, useState } from "react";
import axios from "axios";
import { API, API_HOST } from "../../utils/api";
import { getImageUrl } from "../../utils/videoHelpers";

function HeroSectionAdmin() {
  const token = localStorage.getItem("adminToken");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);

  const [form, setForm] = useState({
    badge: "",
    titleLine1: "",
    titleHighlight: "",
    description: "",
    primaryButtonText: "",
    primaryButtonLink: "",
    secondaryButtonText: "",
    secondaryButtonLink: "",
    otpCardTitle: "",
    otpCardSubtitle: "",
    otpSendButtonText: "",
    otpVerifyButtonText: "",
    otpHelperText: "",
    heroVideo: "",
  });

  useEffect(() => {
    fetchHeroSettings();
  }, []);

  const fetchHeroSettings = async () => {
    try {
      const res = await axios.get(`${API}/site-settings`);

      if (res.data.success) {
        const hero = res.data.settings?.heroSection || {};
        setForm({
          badge: hero.badge || "",
          titleLine1: hero.titleLine1 || "",
          titleHighlight: hero.titleHighlight || "",
          description: hero.description || "",
          primaryButtonText: hero.primaryButtonText || "",
          primaryButtonLink: hero.primaryButtonLink || "",
          secondaryButtonText: hero.secondaryButtonText || "",
          secondaryButtonLink: hero.secondaryButtonLink || "",
          otpCardTitle: hero.otpCardTitle || "",
          otpCardSubtitle: hero.otpCardSubtitle || "",
          otpSendButtonText: hero.otpSendButtonText || "",
          otpVerifyButtonText: hero.otpVerifyButtonText || "",
          otpHelperText: hero.otpHelperText || "",
          heroVideo: hero.heroVideo || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch hero settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setVideoUploading(true);
      const fd = new FormData();
      fd.append("image", file);

      const res = await axios.post(`${API_HOST}/upload`, fd, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        setForm((prev) => ({
          ...prev,
          heroVideo: res.data.image,
        }));
      }
    } catch (error) {
      alert("Video upload failed");
    } finally {
      setVideoUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const payload = {
        heroSection: {
          ...form,
        },
      };

      const res = await axios.put(`${API}/site-settings/update`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        alert("Hero section updated successfully");
        fetchHeroSettings();
      }
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to update hero section");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-[1450px] p-4 md:p-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm text-slate-600">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1450px] p-4 md:p-6">
      <form onSubmit={handleSave} className="space-y-6">
        <div className="sticky top-4 z-20 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#07111a]">
                Hero Section
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                 Manage hero section content including text, buttons, and background video from here.
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-gradient-to-r from-[#0b5c8e] via-[#167a7a] to-[#2e8b57] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Hero Section"}
            </button>
          </div>
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50/80 px-5 py-4">
            <h2 className="text-xl font-semibold text-[#07111a]">Hero Content</h2>
          </div>

          <div className="grid gap-4 p-5 md:grid-cols-2 md:p-6">
            <Input
              value={form.badge}
              onChange={(e) => handleChange("badge", e.target.value)}
              placeholder="Badge"
            />
            <Input
              value={form.titleLine1}
              onChange={(e) => handleChange("titleLine1", e.target.value)}
              placeholder="Title Line 1"
            />
            <Input
              value={form.titleHighlight}
              onChange={(e) => handleChange("titleHighlight", e.target.value)}
              placeholder="Highlighted Title"
            />
            <Input
              value={form.primaryButtonText}
              onChange={(e) => handleChange("primaryButtonText", e.target.value)}
              placeholder="Primary Button Text"
            />
            <Input
              value={form.primaryButtonLink}
              onChange={(e) => handleChange("primaryButtonLink", e.target.value)}
              placeholder="Primary Button Link"
            />
            <Input
              value={form.secondaryButtonText}
              onChange={(e) => handleChange("secondaryButtonText", e.target.value)}
              placeholder="Secondary Button Text"
            />
            <Input
              value={form.secondaryButtonLink}
              onChange={(e) => handleChange("secondaryButtonLink", e.target.value)}
              placeholder="Secondary Button Link"
            />
            <Input
              value={form.otpCardTitle}
              onChange={(e) => handleChange("otpCardTitle", e.target.value)}
              placeholder="OTP Card Title"
            />
            <Input
              value={form.otpCardSubtitle}
              onChange={(e) => handleChange("otpCardSubtitle", e.target.value)}
              placeholder="OTP Card Subtitle"
            />
            <Input
              value={form.otpSendButtonText}
              onChange={(e) => handleChange("otpSendButtonText", e.target.value)}
              placeholder="OTP Send Button Text"
            />
            <Input
              value={form.otpVerifyButtonText}
              onChange={(e) => handleChange("otpVerifyButtonText", e.target.value)}
              placeholder="OTP Verify Button Text"
            />
            <Input
              value={form.otpHelperText}
              onChange={(e) => handleChange("otpHelperText", e.target.value)}
              placeholder="OTP Helper Text"
            />
            <div className="md:col-span-2">
              <Textarea
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Hero Description"
                rows={4}
              />
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50/80 px-5 py-4">
            <h2 className="text-xl font-semibold text-[#07111a]">Hero Video</h2>
          </div>

          <div className="p-5 md:p-6">
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-[15px] text-[#07111a] outline-none transition focus:border-[#167a7a] focus:ring-2 focus:ring-[#167a7a]/10"
            />

            <p className="mt-3 text-sm text-slate-500">
              {videoUploading ? "Uploading video..." : "Upload hero background video here."}
            </p>

            {form.heroVideo ? (
              <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
                <video
                  src={getImageUrl(form.heroVideo)}
                  controls
                  className="max-h-[420px] w-full bg-black object-cover"
                />
              </div>
            ) : null}
          </div>
        </section>
      </form>
    </div>
  );
}

export default HeroSectionAdmin;

function Input({ value, onChange, placeholder }) {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-[15px] text-[#07111a] outline-none transition focus:border-[#167a7a] focus:ring-2 focus:ring-[#167a7a]/10"
    />
  );
}

function Textarea({ value, onChange, placeholder, rows = 4 }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-[15px] text-[#07111a] outline-none transition focus:border-[#167a7a] focus:ring-2 focus:ring-[#167a7a]/10"
    />
  );
}