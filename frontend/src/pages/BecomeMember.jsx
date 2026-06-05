import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  BadgeIndianRupee,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MobileBottomNav from "../components/videos/MobileBottomNav";
import { API } from "../utils/api";
import { getExternalUrl } from "../utils/videoHelpers";

function BecomeMember() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API}/plan-settings`);
        const data = await res.json();

        if (data.success && data.settings?.memberSection) {
          setSettings(data.settings.memberSection);
        }
      } catch (error) {
        console.error("Failed to fetch member plans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const plans = useMemo(
    () => (settings?.plans || []).filter((item) => item.active),
    [settings],
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

      <section className="relative overflow-hidden pt-[45px] pb-10 sm:pt-[60px] lg:pt-[70px] lg:pb-14">
        <div
          className="absolute inset-0"
          style={{ background: "var(--mc-surface-gradient)" }}
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div>
            <p className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300">
              Become a Member
            </p>

            <h1 className="mt-5 max-w-3xl text-[34px] font-extrabold leading-[1.08] tracking-tight sm:text-[46px] lg:text-[58px]">
              Start learning, growing and earning with Multiclout.
            </h1>

            <p
              className="mt-5 max-w-2xl text-[15px] leading-8 sm:text-base"
              style={{ color: "var(--mc-text-soft)" }}
            >
              Choose a business membership plan and unlock member access,
              learning resources and earning opportunities from one platform.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href="https://multiclout.com/portal/user/resource_login.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-[#2d7084] to-[#4d9a97] px-7 text-sm font-bold text-black md:!text-white shadow-[0_16px_40px_rgba(45,112,132,0.28)] transition hover:scale-[1.02]"
              >
                Member Login
              </a>

              <a
                href="https://multiclout.com/portal/welcome/registration.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-full border px-7 text-sm font-bold transition"
                style={{
                  borderColor: "var(--mc-border)",
                  background: "var(--mc-bg-card)",
                  color: "var(--mc-text-main)",
                }}
              >
                Member Register
              </a>
            </div>
          </div>

          <div
            className="hidden md:block rounded-[32px] border p-5 shadow-[0_24px_70px_rgba(0,0,0,0.22)] sm:p-6"
            style={{
              background: "var(--mc-bg-card)",
              borderColor: "var(--mc-border)",
            }}
          >
            <div className="grid gap-4">
              {[
                {
                  icon: BadgeIndianRupee,
                  title: "Earning Access",
                  text: "Membership plans help users access business earning opportunities.",
                },
                {
                  icon: UsersRound,
                  title: "Member Community",
                  text: "Grow with learning, business guidance and practical resources.",
                },
                {
                  icon: ShieldCheck,
                  title: "Admin Managed Plans",
                  text: "Plans stay fully dynamic from your existing admin panel.",
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="flex gap-4 rounded-3xl border p-4"
                    style={{
                      background: "var(--mc-bg-soft)",
                      borderColor: "var(--mc-border)",
                    }}
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
                      <Icon size={22} />
                    </span>

                    <div>
                      <h3 className="text-base font-bold">{item.title}</h3>
                      <p
                        className="mt-1 text-sm leading-6"
                        style={{ color: "var(--mc-text-soft)" }}
                      >
                        {item.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16 sm:pb-20 lg:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">
              Membership Plans
            </p>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
              {settings?.heading || "Choose your member plan"}
            </h2>
            <p
              className="mx-auto mt-4 max-w-2xl text-sm leading-7 sm:text-base"
              style={{ color: "var(--mc-text-soft)" }}
            >
              {settings?.subtitle ||
                "Select a plan and continue with your membership journey."}
            </p>
          </div>

          {loading ? (
            <div
              className="flex min-h-[260px] items-center justify-center rounded-[28px] border"
              style={{
                background: "var(--mc-bg-card)",
                borderColor: "var(--mc-border)",
                color: "var(--mc-text-soft)",
              }}
            >
              Loading member plans...
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

                  <h3 className="text-[26px] font-bold leading-tight">
                    {plan.title || "Member Plan"}
                  </h3>

                  <div className="mt-6 flex flex-wrap items-end gap-2">
                    <span className="text-sm font-semibold text-cyan-300">
                      Rs.
                    </span>

                    <span className="text-[44px] font-extrabold leading-none">
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
                      / One Year
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
                      ) : null,
                    )}
                  </div>

                  <a
                    href={plan.buttonLink ? getExternalUrl(plan.buttonLink) : "/register"}
                    className={`mt-8 inline-flex h-12 w-full items-center justify-center rounded-2xl px-5 text-sm font-bold text-white shadow-[0_16px_40px_rgba(16,185,129,0.22)] transition hover:opacity-95 ${
                      plan.popular
                        ? "bg-gradient-to-r from-cyan-500 to-emerald-500"
                        : "border border-cyan-400/35 bg-cyan-400/10 hover:bg-cyan-400/15"
                    }`}
                  >
                    {plan.buttonText || settings?.ctaText || "Join Now"}
                    <span className="ml-2">→</span>
                  </a>
                </div>
              ))}

              {/* FRANCHISE MEMBER CARD */}
<div
  className="relative flex h-full flex-col rounded-[30px] border p-6 shadow-[0_20px_60px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-1"
  style={{
    background: "var(--mc-bg-card)",
    borderColor: "var(--mc-border)",
  }}
>
  {/* BADGES */}
  <div className="mb-5 flex items-center justify-between gap-3">
    <span className="rounded-full border border-[#2f8f9d]/20 bg-[#2f8f9d]/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#2f8f9d]">
      Franchise Access
    </span>

    <span className="rounded-full bg-gradient-to-r from-[#2f8f9d] to-[#58b8b4] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white shadow-lg">
      BUSINESS GROWTH
    </span>
  </div>

  {/* TITLE */}
  <h3 className="text-[26px] font-bold leading-tight">
    Multiclout Franchise Membership
  </h3>

  {/* PRICE */}
  <div className="mt-6 flex flex-wrap items-end gap-2">
    <span className="text-sm font-semibold text-cyan-300">
  Franchise Plans
</span>
  </div>

  {/* RANGES */}
  {/* <div className="mt-5 flex flex-wrap gap-3">
    {["1 Lakh", "2 Lakh", "4 Lakh", "5 Lakh"].map((item) => (
      <span
        key={item}
        className="rounded-full border border-[#2f8f9d]/20 bg-[#2f8f9d]/10 px-4 py-2 text-sm font-bold text-[#2f8f9d]"
      >
        {item}
      </span>
    ))}
  </div> */}

  {/* DESCRIPTION */}
  <p
    className="mt-6 border-b pb-4 text-[15px] font-semibold leading-7"
    style={{
      borderColor: "var(--mc-border)",
      color: "var(--mc-text-main)",
    }}
  >
    Build your own profitable Multiclout franchise with complete setup,
training and business growth support.
  </p>

  {/* FEATURES */}
  <div className="mt-5 flex-1 space-y-3">
    {[
  "1 Lakh Startup Franchise Plan",
  "2 Lakh Growth Franchise Plan",
  "4 Lakh Advanced Business Setup",
  "5 Lakh Premium Franchise Model",
  "Online + Offline Business Training",
  "Marketing & Branding Support",
  "Student Leads & Growth Guidance",
].map((item, i) => (
      <div
        key={i}
        className="flex items-start gap-3 text-sm leading-7"
        style={{ color: "var(--mc-text-soft)" }}
      >
        <CheckCircle2
          size={17}
          className="mt-1 shrink-0 text-cyan-300"
        />
        <span>{item}</span>
      </div>
    ))}
  </div>

  {/* BUTTON */}
  <a
    href="https://wa.me/917206123452"
    target="_blank"
    rel="noopener noreferrer"
    className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[#2f8f9d] to-[#58b8b4] px-5 text-sm font-bold text-white shadow-[0_16px_40px_rgba(45,112,132,0.28)] transition hover:scale-[1.01]"
  >
    Contact On WhatsApp
    <span className="ml-2">→</span>
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
              <p>No member plans available right now.</p>
              <p
                className="mt-2 text-sm"
                style={{ color: "var(--mc-text-faint)" }}
              >
                Add active member plans from the admin panel.
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

export default BecomeMember;
