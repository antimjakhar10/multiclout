import { useEffect, useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MobileBottomNav from "../components/videos/MobileBottomNav";
import { API, getExternalUrl } from "../utils/videoHelpers";

function BusinessPlan() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/plan-settings`);
      const data = await res.json();

      if (data.success && data.settings?.businessSection) {
        setSettings(data.settings.businessSection);
      }
    } catch (error) {
      console.error("Failed to fetch business plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const plans = useMemo(
    () => (settings?.plans || []).filter((item) => item.active),
    [settings]
  );

  return (
    <div
      className="min-h-screen pb-20 md:pb-0"
      style={{
        background: "var(--mc-bg-main)",
        color: "var(--mc-text-main)",
      }}
    >
      <Navbar />

      <section className="relative overflow-hidden pb-14 pt-[90px] sm:pb-16 sm:pt-[110px] lg:pb-20 lg:pt-[130px]">
        <div
          className="absolute inset-0"
          style={{ background: "var(--mc-surface-gradient)" }}
        />

        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300">
            {settings?.badge || "Business Plans"}
          </p>

          <h1
            className="mx-auto mt-5 max-w-4xl text-[34px] font-extrabold leading-[1.08] tracking-tight sm:text-[44px] lg:text-[56px]"
            style={{ color: "var(--mc-text-main)" }}
          >
            {settings?.heading || "Choose the right plan for your growth"}
          </h1>

          <p
            className="mx-auto mt-5 max-w-2xl text-[15px] leading-8 sm:text-base"
            style={{ color: "var(--mc-text-soft)" }}
          >
            {settings?.subtitle ||
              "Simple pricing for creators, learners and business users."}
          </p>
        </div>
      </section>

      <section className="pb-16 sm:pb-20 lg:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div
              className="flex min-h-[260px] items-center justify-center rounded-[28px] border"
              style={{
                background: "var(--mc-bg-card)",
                borderColor: "var(--mc-border)",
                color: "var(--mc-text-soft)",
              }}
            >
              Loading plans...
            </div>
          ) : plans.length > 0 ? (
            <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
              {plans.map((plan, index) => (
                <div
                  key={plan.key || index}
                  className="relative flex h-full flex-col rounded-[30px] border p-6 shadow-[0_20px_60px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-1"
                  style={{
                    background: plan.popular
                      ? "linear-gradient(180deg, rgba(34,211,238,0.13), var(--mc-bg-card))"
                      : "var(--mc-bg-card)",
                    borderColor: plan.popular
                      ? "rgba(34,211,238,0.35)"
                      : "var(--mc-border)",
                  }}
                >
                  {plan.badge ? (
                    <div className="mb-5">
                      <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-300">
                        {plan.badge}
                      </span>
                    </div>
                  ) : null}

                  <h3
                    className="text-[26px] font-bold leading-tight"
                    style={{ color: "var(--mc-text-main)" }}
                  >
                    {plan.title || plan.badge || "Business Plan"}
                  </h3>

                  <div className="mt-6 flex flex-wrap items-end gap-2">
                    <span className="text-sm font-semibold text-cyan-300">
                      Rs.
                    </span>

                    <span
                      className="text-[44px] font-extrabold leading-none"
                      style={{ color: "var(--mc-text-main)" }}
                    >
                      {plan.price || "0"}
                    </span>

                    {plan.oldPrice ? (
                      <span
                        className="pb-1 text-sm line-through"
                        style={{ color: "var(--mc-text-faint)" }}
                      >
                        {plan.oldPrice}
                      </span>
                    ) : null}

                    <span
                      className="pb-1 text-sm"
                      style={{ color: "var(--mc-text-faint)" }}
                    >
                      / Lifetime
                    </span>
                  </div>

                  {plan.subtitle ? (
                    <p
                      className="mt-6 border-b pb-4 text-[15px] font-semibold leading-7"
                      style={{
                        borderColor: "var(--mc-border)",
                        color: "var(--mc-text-main)",
                      }}
                    >
                      {plan.subtitle}
                    </p>
                  ) : null}

                  <div className="mt-5 flex-1 space-y-3">
                    {(plan.features || []).map((feature, i) =>
                      feature?.text ? (
                        <div
                          key={i}
                          className="flex items-start gap-3 text-sm leading-7"
                          style={{ color: "var(--mc-text-soft)" }}
                        >
                          <CheckCircle2
                            size={17}
                            className="mt-1 shrink-0 text-cyan-300"
                          />
                          <span>{feature.text}</span>
                        </div>
                      ) : null
                    )}
                  </div>

                  <a
                    href={plan.buttonLink ? getExternalUrl(plan.buttonLink) : "#"}
                    className={`mt-8 inline-flex h-12 w-full items-center justify-center rounded-2xl px-5 text-sm font-bold text-white shadow-[0_16px_40px_rgba(16,185,129,0.22)] transition hover:opacity-95 ${
                      plan.popular
                        ? "bg-gradient-to-r from-cyan-500 to-emerald-500"
                        : "border border-cyan-400/35 bg-cyan-400/10 hover:bg-cyan-400/15"
                    }`}
                  >
                    {plan.buttonText || settings?.ctaText || "JOIN NOW"}
                    <span className="ml-2">→</span>
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="flex min-h-[260px] flex-col items-center justify-center rounded-[28px] border px-5 text-center"
              style={{
                background: "var(--mc-bg-card)",
                borderColor: "var(--mc-border)",
                color: "var(--mc-text-soft)",
              }}
            >
              <p>No business plans available right now.</p>
              <p
                className="mt-2 text-sm"
                style={{ color: "var(--mc-text-faint)" }}
              >
                Admin panel se active plans add karo.
              </p>
            </div>
          )}
        </div>
      </section>

      <div className="hidden md:block">
        <Footer />
      </div>

      <div className="md:hidden">
        <MobileBottomNav />
      </div>
    </div>
  );
}

export default BusinessPlan;