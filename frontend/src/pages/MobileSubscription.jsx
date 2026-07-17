import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, ShieldCheck, PlayCircle, ChevronLeft } from "lucide-react";
import { API, getImageUrl } from "../utils/videoHelpers";
import logo from "../assets/multiclout-logo.png";

function MobileSubscription() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState("trial_monthly");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API}/plan-settings`);
      const data = await res.json();

      if (data.success && data.settings?.mobileSection) {
        const mobileSection = data.settings.mobileSection;
        setSettings(mobileSection);

        const firstActivePlan =
          (mobileSection.plans || []).find((item) => item.active)?.key ||
          "trial_monthly";

        setSelectedPlan(firstActivePlan);
      }
    } catch (error) {
      console.error("Failed to fetch mobile plan settings:", error);
    }
  };

  const plans = useMemo(
    () => (settings?.plans || []).filter((item) => item.active),
    [settings]
  );

  const selectedPlanData = useMemo(
    () => plans.find((item) => item.key === selectedPlan) || null,
    [plans, selectedPlan]
  );

  const handleContinueWithoutPlan = async () => {
    if (!acceptedTerms) return;

    try {
      setLoading(true);

      const token =
        localStorage.getItem("userToken") || localStorage.getItem("token");

      const res = await fetch(`${API}/users/onboarding/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          acceptedTerms: true,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/");
      } else {
        alert(data.message || "Unable to continue");
      }
    } catch (error) {
      console.error("Continue without plan failed:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleBuyPlan = () => {
    if (!acceptedTerms || !selectedPlanData) return;

    navigate("/payment-methods", {
      state: {
        selectedPlan: selectedPlanData,
        acceptedTerms: true,
        source: "mobile-subscription",
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#07111a] text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-6 sm:px-6">
        <div className="w-full max-w-md rounded-[30px] border border-cyan-400/10 bg-[#0b1622]/95 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.45)] sm:p-5">
        <button
  type="button"
  onClick={() => navigate(-1)}
  className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white/75 transition hover:bg-white/[0.08] hover:text-white"
>
  <ChevronLeft size={15} />
  Back
</button>
          <div className="mb-4 text-center">
            <img
              src={logo}
              alt="Multiclout logo"
              className="mx-auto h-10 w-auto object-contain"
            />
          </div>

          {settings?.heroVideo ? (
            <div className="mb-5 overflow-hidden rounded-[24px] border border-cyan-400/20 bg-black">
              <div className="relative">
                <video
                  src={getImageUrl(settings.heroVideo)}
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                  className="h-[210px] w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4">
                  <div className="flex items-center gap-2 text-white">
                    <PlayCircle size={18} className="text-cyan-300" />
                    <span className="text-sm font-medium">
                      {settings?.videoTitle || "Watch premium preview"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          <div className="rounded-[26px] border border-white/10 bg-white/[0.03] p-4 sm:p-5">
            <div className="mb-5 text-center">
              <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-300">
                {settings?.badge || "Premium Access"}
              </p>

              <h2 className="mt-2 text-[24px] font-bold leading-tight">
                {settings?.heading || "Choose your plan"}
              </h2>

              <p className="mt-2 text-sm leading-6 text-white/60">
                {settings?.subtitle ||
                  "Unlock all videos or continue with basic access"}
              </p>
            </div>

            <div className="space-y-3">
              {plans.map((plan) => {
                const active = selectedPlan === plan.key;

                return (
                  <button
                    key={plan.key}
                    type="button"
                    onClick={() => setSelectedPlan(plan.key)}
                    className={`w-full rounded-[22px] border p-4 text-left transition-all duration-200 ${
                      active
                        ? "border-cyan-400 bg-cyan-400/10 shadow-[0_0_0_1px_rgba(34,211,238,0.15)]"
                        : "border-white/10 bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.05]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-[15px] font-semibold">
                          {plan.title}
                        </h3>
                        <p className="mt-1 text-xs text-white/55">
                          {plan.subtitle}
                        </p>
                      </div>

                      {plan.badge ? (
                        <span className="rounded-full bg-cyan-400/10 px-2.5 py-1 text-[10px] font-semibold text-cyan-300">
                          {plan.badge}
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-3 flex items-end gap-2">
                      <span className="text-[18px] font-bold">{plan.price}</span>
                      {plan.oldPrice ? (
                        <span className="pb-[2px] text-xs text-white/35 line-through">
                          {plan.oldPrice}
                        </span>
                      ) : null}
                    </div>

                    {active ? (
                      <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-cyan-300">
                        <CheckCircle2 size={14} />
                        Selected
                      </div>
                    ) : null}
                  </button>
                );
              })}
            </div>

             <div className="mt-5 text-sm text-white/60">
              <label className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent accent-cyan-400"
                />

                <span className="leading-6">
                  I agree to{" "}
                  <span
                    onClick={() => navigate("/terms-and-conditions")}
                    className="cursor-pointer font-medium text-cyan-300"
                  >
                    Terms & Conditions
                  </span>
                </span>
              </label>

              <div className="mt-2 flex items-center gap-2 text-xs text-white/40">
                <ShieldCheck size={13} />
                Required to continue
              </div>
            </div>

            <button
              type="button"
              onClick={handleBuyPlan}
              disabled={loading || !selectedPlanData || !acceptedTerms}
              className="mt-5 h-12 w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Processing..." : settings?.buyButtonText || "Buy Plan"}
            </button>

           

            <button
              type="button"
              onClick={handleContinueWithoutPlan}
              disabled={!acceptedTerms || loading}
              className="mt-4 h-11 w-full rounded-2xl border border-white/10 bg-transparent text-sm font-medium text-white transition hover:bg-white/[0.03] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {settings?.continueButtonText || "Continue Without Plan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MobileSubscription;