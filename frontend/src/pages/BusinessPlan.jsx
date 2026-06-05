import { useEffect, useMemo, useState } from "react";
import {
  Rocket,
  TrendingUp,
  BriefcaseBusiness,
  GraduationCap,
  Sparkles,
  PlayCircle,
  BadgeCheck,
  ShieldCheck,
} from "lucide-react";

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
    [settings],
  );

  const getFeatureIcon = (index) => {
    const icons = [
      Rocket,
      TrendingUp,
      BriefcaseBusiness,
      GraduationCap,
      Sparkles,
      PlayCircle,
      BadgeCheck,
      ShieldCheck,
    ];

    return icons[index % icons.length];
  };

  const getIconBg = (index) => {
    const colors = [
      "bg-cyan-100 text-cyan-600",
      "bg-emerald-100 text-emerald-600",
      "bg-violet-100 text-violet-600",
      "bg-orange-100 text-orange-600",
      "bg-pink-100 text-pink-600",
      "bg-blue-100 text-blue-600",
      "bg-yellow-100 text-yellow-700",
      "bg-red-100 text-red-600",
    ];

    return colors[index % colors.length];
  };

  return (
    <div
      className="min-h-screen pb-20 md:pb-0"
      style={{
        background: "var(--mc-bg-main)",
        color: "var(--mc-text-main)",
      }}
    >
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden pb-10 pt-[36px] sm:pb-12 sm:pt-[44px] lg:pb-14 lg:pt-[52px]">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(34,211,238,0.03) 0%, rgba(255,255,255,0) 100%)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300">
            {settings?.badge || "Business Plans"}
          </p>

          <h1
            className="mx-auto mt-3 max-w-4xl text-[34px] font-extrabold leading-[1.04] tracking-tight sm:text-[44px] lg:text-[56px]"
            style={{ color: "var(--mc-text-main)" }}
          >
            {settings?.heading || "Choose the right plan for your growth"}
          </h1>

          <p
            className="mx-auto mt-4 max-w-2xl text-[15px] leading-8 sm:text-base"
            style={{ color: "var(--mc-text-soft)" }}
          >
            {settings?.subtitle ||
              "Simple pricing for creators, learners and business users."}
          </p>
        </div>
      </section>

      {/* PLANS */}
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
            <div className="grid gap-7 lg:grid-cols-3">
              {plans.map((plan, index) => {
                const isFirst = index === 0;
                const isSecond = index === 1;

                let features = [...(plan.features || [])];

                // FIRST CARD ME 4 EXTRA FEATURES ADD
                if (isFirst && plans[1]?.features?.length) {
                  const extraFeatures = [
                    {
                      text: "Master Social Media Ads (Meta Ads Strategy)",
                      disabled: true,
                    },
                    {
                      text: "Turn Views Into Income (Youtube Monetization Secrets)",
                      disabled: true,
                    },
                    {
                      text: "Canva Mastery (Design Like a Pro - No Experience Needed)",
                      disabled: true,
                    },
                    {
                      text: "Ai Tools For Smart Work & Fast Growth",
                      disabled: true,
                    },
                  ];

                  features = [...features, ...extraFeatures];
                }

                return (
                  <div
                    key={plan.key || index}
                    className={`relative flex h-full flex-col overflow-hidden rounded-[32px] border p-6 transition-all duration-300 hover:-translate-y-1 ${
                      isFirst
                        ? "lg:col-span-1"
                        : isSecond
                          ? "lg:col-span-1"
                          : ""
                    } ${
                      plan.popular
                        ? "shadow-[0_24px_70px_rgba(16,185,129,0.12)]"
                        : "shadow-[0_18px_50px_rgba(0,0,0,0.10)]"
                    }`}
                    style={{
                      background: plan.popular
                        ? "linear-gradient(180deg, rgba(34,211,238,0.12), rgba(255,255,255,0.98))"
                        : "var(--mc-bg-card)",

                      borderColor: plan.popular
                        ? "rgba(34,211,238,0.30)"
                        : "var(--mc-border)",
                    }}
                  >
                    {/* POPULAR */}
                    {plan.popular && (
                      <div className="absolute right-5 top-5 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white shadow-lg">
                        MOST POPULAR
                      </div>
                    )}

                    {/* BADGE */}
                    {plan.badge ? (
                      <div className="mb-5">
                        <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-300">
                          {plan.badge}
                        </span>
                      </div>
                    ) : null}

                    {/* TITLE */}
                    <h3
                      className="text-[28px] font-extrabold leading-tight"
                      style={{ color: "var(--mc-text-main)" }}
                    >
                      {plan.title || plan.badge || "Business Plan"}
                    </h3>

                    {/* PRICE */}
                    <div
                      className="mt-6 border-b pb-5"
                      style={{
                        borderColor: "var(--mc-border)",
                      }}
                    >
                      <div className="flex flex-wrap items-end gap-2">
                        <span className="pb-[6px] text-sm font-semibold text-cyan-300">
                          Rs.
                        </span>

                        <span
                          className="text-[52px] font-extrabold leading-none"
                          style={{ color: "var(--mc-text-main)" }}
                        >
                          {plan.price || "0"}
                        </span>

                        {plan.oldPrice ? (
                          <span
                            className="pb-1 text-[16px] line-through"
                            style={{ color: "var(--mc-text-faint)" }}
                          >
                            {plan.oldPrice}
                          </span>
                        ) : null}

                        <span
                          className="pb-1 text-sm"
                          style={{ color: "var(--mc-text-faint)" }}
                        >
                          / One Year
                        </span>
                      </div>

                      {plan.subtitle ? (
                        <p
                          className="mt-5 text-[16px] font-semibold leading-8"
                          style={{
                            color: "var(--mc-text-main)",
                          }}
                        >
                          {plan.subtitle}
                        </p>
                      ) : null}
                    </div>

                    {/* FEATURES */}
                    <div className="mt-6 flex-1 space-y-4">
                      {features.map((feature, i) => {
                        if (!feature?.text) return null;

                        const Icon = getFeatureIcon(i);

                        return (
                          <div
                            key={i}
                            className={`flex items-start gap-4 rounded-[18px] border px-4 py-3 backdrop-blur-sm transition duration-300 ${
                              feature.disabled
                                ? "border-gray-200 bg-gray-50/70 opacity-70"
                                : "border-cyan-100/60 bg-white/60 hover:border-cyan-200 hover:bg-white/80"
                            }`}
                          >
                            <div
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${getIconBg(
                                i,
                              )}`}
                            >
                              <Icon size={18} />
                            </div>

                            <div className="flex-1">
                              <span
                                className={`text-[15px] leading-7 ${
                                  feature.disabled
                                    ? "line-through text-gray-400"
                                    : ""
                                }`}
                              >
                                {feature.text}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* BUTTON */}
                    <a
                      href={
                        plan.buttonLink ? getExternalUrl(plan.buttonLink) : "#"
                      }
                      className={`mt-8 inline-flex h-[56px] w-full items-center justify-center rounded-[18px] px-5 text-[15px] font-bold shadow-[0_16px_40px_rgba(16,185,129,0.18)] transition-all duration-300 hover:scale-[1.01] ${
                        plan.popular
                          ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-white"
                          : "border border-cyan-400/30 bg-cyan-400/10 text-cyan-700 hover:bg-cyan-400/15"
                      }`}
                    >
                      {plan.buttonText || settings?.ctaText || "JOIN NOW"}

                      <span className="ml-2 text-base">→</span>
                    </a>
                  </div>
                );
              })}

              {/* FRANCHISE CARD */}
              <div
                className="relative flex h-full flex-col overflow-hidden rounded-[32px] border p-6 shadow-[0_18px_50px_rgba(0,0,0,0.10)] transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "var(--mc-bg-card)",
                  borderColor: "var(--mc-border)",
                }}
              >
                {/* TOP BADGES */}
                <div className="mb-5 flex items-center justify-between gap-3">
                  <span className="rounded-full border border-[#2f8f9d]/20 bg-[#2f8f9d]/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#2f8f9d]">
                    Franchise Plan
                  </span>

                  <span className="rounded-full bg-gradient-to-r from-[#2f8f9d] to-[#58b8b4] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white shadow-lg">
                    HIGH PROFIT
                  </span>
                </div>

                {/* TITLE */}
                <h3
                  className="text-[28px] font-extrabold leading-tight"
                  style={{ color: "var(--mc-text-main)" }}
                >
                  Multiclout Franchise
                </h3>

                {/* SUBTEXT */}
                <div
                  className="mt-6 border-b pb-5"
                  style={{
                    borderColor: "var(--mc-border)",
                  }}
                >
                  <div className="flex flex-wrap items-end gap-2">
                    <span className="pb-[6px] text-sm font-semibold text-[#2f8f9d]">
                      Investment Ranges
                    </span>
                  </div>

                  {/* RANGES
    <div className="mt-4 flex flex-wrap gap-3">
      {[
        "1 Lakh",
        "2 Lakh",
        "4 Lakh",
        "5 Lakh",
      ].map((range) => (
        <span
          key={range}
          className="rounded-full border border-[#2f8f9d]/20 bg-[#2f8f9d]/10 px-4 py-2 text-[14px] font-bold text-[#2f8f9d]"
        >
          {range}
        </span>
      ))}
    </div> */}

                  <p
                    className="mt-5 text-[16px] font-semibold leading-8"
                    style={{
                      color: "var(--mc-text-main)",
                    }}
                  >
                    Start your own Multiclout franchise and build a profitable
                    education & business network in your city.
                  </p>
                </div>

                {/* FEATURES */}
                <div className="mt-6 flex-1 space-y-4">
                  {[
                    "1 Lakh Plan – Basic Startup Franchise Setup",
                    "2 Lakh Plan – Training + Marketing Support",
                    "4 Lakh Plan – Advanced Growth & Team Expansion",
                    "5 Lakh Plan – Premium Full Business Ecosystem",
                    "Online + Offline Business Training Program",
                    "Complete Branding & Marketing Guidance",
                    "Student Leads & Local Area Growth Support",
                    "High Income & Long-Term Business Opportunity",
                    "Ready-To-Use Multiclout Brand Ecosystem",
                  ].map((item, i) => {
                    const Icon = getFeatureIcon(i);

                    return (
                      <div
                        key={i}
                        className="flex items-start gap-4 rounded-[18px] border border-[#2f8f9d]/10 bg-[#2f8f9d]/5 px-4 py-3 backdrop-blur-sm transition duration-300 hover:bg-[#2f8f9d]/10"
                      >
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${getIconBg(
                            i,
                          )}`}
                        >
                          <Icon size={18} />
                        </div>

                        <div className="flex-1">
                          <span
                            className="text-[15px] leading-7"
                            style={{ color: "var(--mc-text-main)" }}
                          >
                            {item}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* BUTTON */}
                <a
                  href="https://wa.me/917206123452"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex h-[56px] w-full items-center justify-center rounded-[18px] bg-gradient-to-r from-[#2f8f9d] to-[#58b8b4] px-5 text-[15px] font-bold text-white shadow-[0_16px_40px_rgba(47,143,157,0.22)] transition-all duration-300 hover:scale-[1.01]"
                >
                  Contact On WhatsApp
                  <span className="ml-2 text-base">→</span>
                </a>
              </div>
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
