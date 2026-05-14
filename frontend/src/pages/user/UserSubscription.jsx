import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  BadgeCheck,
  CalendarDays,
  ArrowRight,
  PlayCircle,
  BriefcaseBusiness,
} from "lucide-react";
import { API } from "../../utils/videoHelpers";

function InfoBox({ icon: Icon, label, value, tone = "cyan" }) {
  const toneStyles = {
    cyan: "text-cyan-300",
    emerald: "text-emerald-300",
    yellow: "text-yellow-300",
  };

  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] ${toneStyles[tone]}`}
      >
        <Icon size={18} />
      </div>

      <p className="mt-4 text-sm text-white/55">{label}</p>
      <h3 className="mt-1 text-xl font-bold text-white">{value}</h3>
    </div>
  );
}

function PlanActionCard({
  icon: Icon,
  title,
  description,
  buttonText,
  onClick,
}) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 sm:p-7">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-cyan-300">
          <Icon size={22} />
        </div>

        <div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-white/60">
            {description}
          </p>
        </div>
      </div>

      <button
        onClick={onClick}
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 px-6 py-3 text-sm font-semibold text-white"
      >
        {buttonText}
        <ArrowRight size={16} />
      </button>
    </div>
  );
}

function UserSubscription() {
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
        console.error("Failed to fetch subscription user:", error);
      }
    };

    syncUser();
  }, []);

  const videoPlanLabel = useMemo(() => {
    if (user?.subscriptionPlan === "yearly") return "Yearly Video Plan";
    if (user?.subscriptionPlan === "trial_monthly") return "Monthly Trial";
    return "Basic Video Access";
  }, [user]);

  const videoStatusLabel = useMemo(() => {
    if (user?.subscriptionStatus === "active") return "Active";
    if (user?.subscriptionStatus === "trial") return "Trial";
    return "Inactive";
  }, [user]);

  const videoExpiryLabel = useMemo(() => {
    if (!user?.subscriptionEndDate) return "Not available";

    return new Date(user.subscriptionEndDate).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }, [user]);

  return (
    <div className="space-y-5">
      <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6 sm:p-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300/85">
          Subscription
        </p>

        <h2 className="mt-3 text-[28px] font-bold leading-[1.12] text-white sm:text-[34px]">
          Manage your plans
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
          Manage your video subscription and business membership separately from
          one place.
        </p>
      </div>

      <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-5 sm:p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
            <PlayCircle size={22} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              Video Subscription
            </h3>
            <p className="text-sm text-white/55">
              This plan unlocks premium and locked videos.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <InfoBox
            icon={CreditCard}
            label="Current Plan"
            value={videoPlanLabel}
            tone="cyan"
          />

          <InfoBox
            icon={BadgeCheck}
            label="Status"
            value={videoStatusLabel}
            tone="emerald"
          />

          <InfoBox
            icon={CalendarDays}
            label="Expiry Date"
            value={videoExpiryLabel}
            tone="yellow"
          />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <PlanActionCard
          icon={PlayCircle}
          title="Upgrade Video Access"
          description="Choose a video subscription plan to unlock premium videos and continue watching subscriber-only content."
          buttonText="View Video Plans"
          onClick={() => navigate("/mobile-subscription")}
        />

        <PlanActionCard
          icon={BriefcaseBusiness}
          title="Business Membership"
          description="Choose a business membership plan for earning opportunities, member access, and business growth resources."
          buttonText="View Business Plans"
          onClick={() => navigate("/become-a-member")}
        />
      </div>

      <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 sm:p-7">
        <h3 className="text-xl font-bold text-white">Need help?</h3>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
          Contact support if you need help with your subscription, payment, or
          account access.
        </p>

        <button
          onClick={() => navigate("/account/help-support")}
          className="mt-5 rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/[0.07]"
        >
          Contact Support
        </button>
      </div>
    </div>
  );
}

export default UserSubscription;