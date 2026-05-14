import { useState } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API } from "../../utils/videoHelpers";

function UserDeleteAccount() {
  const navigate = useNavigate();

  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleDelete = async () => {
    setError("");
    setMessage("");

    if (confirmText.trim().toUpperCase() !== "DELETE") {
      setError('Please type "DELETE" to confirm account deletion.');
      return;
    }

    try {
      setLoading(true);

      const token =
        localStorage.getItem("userToken") || localStorage.getItem("token");

      const res = await fetch(`${API}/users/me`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Failed to delete account.");
        return;
      }

      setMessage("Your account has been deleted successfully.");

      localStorage.removeItem("token");
      localStorage.removeItem("userToken");
      localStorage.removeItem("user");
      localStorage.removeItem("verifiedPhoneForRegister");
      localStorage.removeItem("registerMockOtp");

      setTimeout(() => {
        navigate("/");
      }, 1400);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while deleting account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="rounded-[34px] border border-red-500/15 bg-[linear-gradient(180deg,rgba(239,68,68,0.08),rgba(255,255,255,0.02))] p-6 sm:p-7 lg:p-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 text-red-300">
          <AlertTriangle size={24} />
        </div>

        <h2 className="mt-5 text-[30px] font-bold text-white">
          Delete your account
        </h2>

        <p className="mt-4 text-[15px] leading-8 text-white/65">
          This action is permanent. Once your account is deleted, all access will be removed. Please proceed only if you are sure.
        </p>

        <div className="mt-6 rounded-[24px] border border-red-500/15 bg-red-500/10 p-5">
          <h3 className="text-lg font-semibold text-red-200">
            Before you continue
          </h3>

          <ul className="mt-3 space-y-2 text-sm leading-7 text-red-100/80">
            <li>• This action cannot be undone.</li>
            <li>• Your profile access will be removed.</li>
            <li>• You will be logged out automatically.</li>
          </ul>
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-white/75">
            Type <span className="font-bold text-red-300">"DELETE"</span> to
            confirm
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder='Enter "DELETE" to confirm'
            className="h-14 w-full rounded-2xl border border-white/10 bg-white px-4 text-[16px] text-[#0f172a] outline-none placeholder:text-slate-400 focus:border-red-400"
          />
        </div>

        {message ? (
          <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            {message}
          </div>
        ) : null}

        {error ? (
          <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        ) : null}

        <button
          onClick={handleDelete}
          disabled={loading}
          className="mt-6 inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-red-500 px-6 text-[16px] font-semibold text-white shadow-[0_16px_40px_rgba(239,68,68,0.22)] transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Trash2 size={18} />
          {loading ? "Deleting..." : "Delete My Account"}
        </button>
      </div>
    </div>
  );
}

export default UserDeleteAccount;