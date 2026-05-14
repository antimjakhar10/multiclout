import { useEffect, useState } from "react";
import { Save, UserRound, Mail, Phone, FileText } from "lucide-react";
import { API } from "../../utils/videoHelpers";

function UserProfile() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token =
          localStorage.getItem("userToken") || localStorage.getItem("token");

        if (!token) {
          setError("User session not found.");
          setLoading(false);
          return;
        }

        const res = await fetch(`${API}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          setError(data.message || "Failed to fetch profile.");
          setLoading(false);
          return;
        }

        setForm({
          name: data.user?.name || "",
          email: data.user?.email || "",
          phone: data.user?.phone || "",
          bio: data.user?.bio || "",
        });
      } catch (err) {
        console.error(err);
        setError("Something went wrong while loading profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!form.name.trim() || !form.phone.trim()) {
      setError("Name and mobile number are required.");
      return;
    }

    try {
      setSaving(true);

      const token =
        localStorage.getItem("userToken") || localStorage.getItem("token");

      const res = await fetch(`${API}/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          bio: form.bio.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Failed to update profile.");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      setMessage("Profile updated successfully.");
    } catch (err) {
      console.error(err);
      setError("Something went wrong while updating profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 text-sm text-white/70">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6 sm:p-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300/85">
          Profile
        </p>

        <h2 className="mt-3 text-[28px] font-bold leading-[1.12] text-white sm:text-[34px]">
          Manage your profile
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
         Update your personal details and manage your account information.
        </p>
      </div>

      <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white/75">
                <UserRound size={16} />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="h-13 w-full rounded-2xl border border-white/10 bg-white px-4 text-[15px] text-[#0f172a] outline-none placeholder:text-slate-400 focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white/75">
                <Phone size={16} />
                Mobile Number
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter mobile number"
                className="h-13 w-full rounded-2xl border border-white/10 bg-white px-4 text-[15px] text-[#0f172a] outline-none placeholder:text-slate-400 focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white/75">
              <Mail size={16} />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              className="h-13 w-full rounded-2xl border border-white/10 bg-white px-4 text-[15px] text-[#0f172a] outline-none placeholder:text-slate-400 focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white/75">
              <FileText size={16} />
              Bio
            </label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={5}
              placeholder="Write a short bio"
              className="w-full rounded-2xl border border-white/10 bg-white px-4 py-3 text-[15px] text-[#0f172a] outline-none placeholder:text-slate-400 focus:border-cyan-400"
            />
          </div>

          {message ? (
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
              {message}
            </div>
          ) : null}

          {error ? (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          ) : null}

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-6 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(16,185,129,0.24)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Save size={16} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserProfile;