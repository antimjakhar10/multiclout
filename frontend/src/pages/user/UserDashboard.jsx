import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserCircle2,
  CreditCard,
  Headphones,
  ArrowRight,
} from "lucide-react";
import { API } from "../../utils/videoHelpers";

function SummaryCard({ label, value, subtext }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/45">
        {label}
      </p>
      <h3 className="mt-2 text-[24px] font-bold text-white">{value}</h3>
      <p className="mt-2 text-sm leading-6 text-white/55">{subtext}</p>
    </div>
  );
}

function QuickAction({ icon: Icon, title, text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 text-left transition hover:bg-white/[0.06]"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-cyan-300">
        <Icon size={18} />
      </div>

      <h3 className="mt-4 text-base font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-white/58">{text}</p>

      <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300">
        Open <ArrowRight size={15} />
      </span>
    </button>
  );
}

function UserDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const syncUser = async () => {
      try {
        const token =
          localStorage.getItem("userToken") || localStorage.getItem("token");

        if (!token) return;

        const res = await fetch(`${API}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok && data.success && data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
          setUser(data.user);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    syncUser();
  }, []);

  const joinedText = useMemo(() => {
    if (!user?.createdAt) return "Recently joined";
    return new Date(user.createdAt).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }, [user]);

  const planLabel = useMemo(() => {
    if (user?.subscriptionPlan === "yearly") return "Yearly Plan";
    if (user?.subscriptionPlan === "trial_monthly") return "Trial Monthly";
    return "Basic Access";
  }, [user]);

  const statusLabel = useMemo(() => {
    if (user?.subscriptionStatus === "active") return "Active";
    if (user?.subscriptionStatus === "trial") return "Trial";
    return "Inactive";
  }, [user]);

  return (
    <div className="space-y-5">
      <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6 sm:p-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300/85">
          Welcome
        </p>

        <h2 className="mt-3 text-[28px] font-bold leading-[1.12] text-white sm:text-[34px]">
          Hello, {user?.name || "User"}
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
          
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            onClick={() => navigate("/account/profile")}
            className="rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Edit Profile
          </button>

          <button
            onClick={() => navigate("/account/subscription")}
            className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-white/90 transition hover:bg-white/[0.07]"
          >
            View Subscription
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <SummaryCard
          label="Current Plan"
          value={planLabel}
          subtext={`Plan status: ${statusLabel}`}
        />
        <SummaryCard
          label="Member Since"
          value={joinedText}
          subtext={user?.isVerified ? "Verified account" : "Verification pending"}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <QuickAction
          icon={UserCircle2}
          title="Profile"
          text="Update your name, email, number and bio."
          onClick={() => navigate("/account/profile")}
        />
        <QuickAction
          icon={CreditCard}
          title="Subscription"
          text="Check current plan and manage access."
          onClick={() => navigate("/account/subscription")}
        />
        <QuickAction
          icon={Headphones}
          title="Support"
          text="See official support details and help options."
          onClick={() => navigate("/account/help-support")}
        />
      </div>
    </div>
  );
}

export default UserDashboard;