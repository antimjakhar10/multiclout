import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { API } from "../utils/api";
import { getImageUrl } from "../utils/videoHelpers";
import FAQSection from "../components/FAQSection";
import MobileBottomNav from "../components/videos/MobileBottomNav";
import MobileAppHeader from "../components/videos/MobileAppHeader";

const whyIcons = ["📈", "🏆", "🚀", "🎯"];
const partnerIcons = ["🎓", "💼", "✅", "🌱"];
const deliveryIcons = ["🏫", "💻"];
const supportIcons = ["🎨", "📣", "📚", "👥", "📈", "🚀"];

function parseCountValue(value) {
  if (!value) return null;

  const clean = String(value).replace(/,/g, "");
  const match = clean.match(/\d+(\.\d+)?/);

  if (!match) return null;

  return Number(match[0]);
}

function CountUpValue({ value, duration = 1600 }) {
  const numericValue = parseCountValue(value);
  const [displayValue, setDisplayValue] = useState(
    numericValue !== null ? 0 : value
  );

  useEffect(() => {
    if (numericValue === null) {
      setDisplayValue(value);
      return;
    }

    let startTime = null;
    let animationFrame;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const current = Math.floor(progress * numericValue);
      setDisplayValue(current);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      }
    };

    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [numericValue, value, duration]);

  if (numericValue === null) return <>{value}</>;

  const suffix = String(value).replace(/[\d,.\s]/g, "");
  return (
    <>
      {Number(displayValue).toLocaleString()}
      {suffix}
    </>
  );
}

function Franchise() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    investmentRange: "",
    message: "",
  });

  const pageBg =
    "bg-[var(--mc-bg-main)] text-[var(--mc-text-main)] md:bg-white md:text-slate-900";
  const sectionBg =
    "bg-[var(--mc-bg-main)] md:bg-white";
  const sectionAltBg =
    "bg-[var(--mc-surface-gradient)] md:bg-[#f3f7fa]";
  const cardBg =
    "border border-[var(--mc-border)] bg-[var(--mc-bg-card)] text-[var(--mc-text-main)] md:border-slate-200 md:bg-white md:text-slate-900";
  const headingText =
    "text-[var(--mc-text-main)] md:text-[#072b57]";
  const bodyText =
    "text-[var(--mc-text-soft)] md:text-slate-700";
  const mutedText =
    "text-[var(--mc-text-soft)] md:text-slate-600";
  const labelText =
    "text-[var(--mc-text-main)] md:text-[#07111a]";
  const inputClass =
    "w-full rounded-xl border border-[var(--mc-border)] bg-[var(--mc-bg-card)] px-4 py-3 text-sm text-[var(--mc-text-main)] outline-none placeholder:text-[var(--mc-text-soft)] focus:border-[#13b7dc] md:rounded-md md:border-slate-300 md:bg-white md:text-slate-900 md:focus:border-[#0b5c8e]";

  useEffect(() => {
    fetchFranchiseData();
  }, []);

  const fetchFranchiseData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/franchise`);
      const json = await res.json();

      if (json.success) {
        setData(json.data);
      }
    } catch (error) {
      console.error("Failed to fetch franchise data:", error);
    } finally {
      setLoading(false);
    }
  };


  const getYoutubeEmbedUrl = (url) => {
    if (!url) return "";

    try {
      if (url.includes("youtube.com/embed/")) return url;

      const normalMatch = url.match(/[?&]v=([^&]+)/);
      if (normalMatch?.[1]) {
        return `https://www.youtube.com/embed/${normalMatch[1]}`;
      }

      const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
      if (shortMatch?.[1]) {
        return `https://www.youtube.com/embed/${shortMatch[1]}`;
      }

      return url;
    } catch {
      return "";
    }
  };

  const safeLogoUrl = (logo) => {
  if (!logo) return "";

  if (typeof logo === "string") {
    return getImageUrl(logo);
  }

  return getImageUrl(
    logo?.url ||
    logo?.path ||
    logo?.image ||
    logo?.filename ||
    ""
  );
};

  const heroBg = useMemo(() => {
    return getImageUrl(data?.hero?.backgroundImage);
  }, [data?.hero?.backgroundImage]);

  const factsBg = useMemo(() => {
    return getImageUrl(data?.factsSection?.backgroundImage);
  }, [data?.factsSection?.backgroundImage]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const res = await fetch(`${API}/franchise/enquiry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (result.success) {
        alert("Franchise enquiry submitted successfully");
        setFormData({
          name: "",
          email: "",
          phone: "",
          city: "",
          investmentRange: "",
          message: "",
        });
      } else {
        alert(result.message || "Failed to submit enquiry");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong while submitting enquiry");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <div className="sticky top-0 z-[100] hidden md:block bg-white shadow-sm">
  <Navbar />
</div>

        <div className="md:hidden">
          <MobileAppHeader />
        </div>

        <div className="flex min-h-screen items-center justify-center bg-[var(--mc-bg-main)] px-4 pb-24 text-center text-sm text-[var(--mc-text-soft)] md:bg-[#07111a] md:pt-[88px] md:text-lg md:text-white">
          Loading franchise page...
        </div>

        <div className="hidden md:block">
          <Footer />
        </div>

        <div className="md:hidden">
          <MobileBottomNav />
        </div>
      </>
    );
  }

  const topLogos = (data?.logosSection?.logos || []).slice(
    0,
    Math.ceil((data?.logosSection?.logos?.length || 0) / 2)
  );

  const bottomLogos = (data?.logosSection?.logos || []).slice(
    Math.ceil((data?.logosSection?.logos?.length || 0) / 2)
  );

  return (
    <>
      <div className="sticky top-0 z-[100] hidden md:block bg-white shadow-sm">
  <Navbar />
</div>

      <div className="md:hidden">
        <MobileAppHeader />
      </div>

      <div className={`pb-24 md:pb-0 ${pageBg}`}>
        {/* HERO */}
        <section
          className="relative overflow-hidden"
          style={{
            backgroundImage: heroBg
              ? `linear-gradient(rgba(6,17,38,0.72), rgba(6,17,38,0.82)), url(${heroBg})`
              : `linear-gradient(rgba(6,17,38,0.82), rgba(6,17,38,0.84)), url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1600&auto=format&fit=crop")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="mx-auto max-w-[1440px] px-4 py-7 sm:px-6 md:py-12 lg:px-10 lg:py-14">
            <div className="grid items-center gap-6 lg:grid-cols-[1.12fr_0.88fr] xl:gap-14">
              <div className="text-white">
                {data?.hero?.badge && (
                  <div className="inline-flex items-center border-l-4 border-[#facc15] pl-3 text-xs font-medium text-white/90 sm:text-base md:text-lg">
                    {data.hero.badge}
                  </div>
                )}

                <h1 className="mt-4 max-w-4xl text-[28px] font-bold leading-[1.12] sm:text-[38px] md:text-5xl xl:text-6xl">
                  {data?.hero?.title ||
                    "Build your future with a Multiclout Franchise"}
                </h1>

                <p className="mt-3 max-w-3xl text-sm leading-6 text-white/85 sm:text-base sm:leading-7 md:text-lg">
                  {data?.hero?.subtitle ||
                    "Own a future-ready education and digital skills franchise with expert support, strong branding, and scalable growth opportunities."}
                </p>

                {!!data?.hero?.stats?.length && (
                  <div className="mt-5 grid max-w-4xl grid-cols-3 gap-2 sm:gap-4">
                    {data.hero.stats.map((item, index) => (
                      <div
                        key={index}
                        className="rounded-2xl border border-[#facc15]/35 bg-black/20 px-2 py-3 text-center shadow-lg backdrop-blur-sm sm:px-5 sm:py-5"
                      >
                        <div className="text-xl font-bold text-white sm:text-3xl md:text-4xl">
                          {item.value}
                        </div>
                        <div className="mt-1 text-[10px] leading-snug text-white/85 sm:text-sm md:text-base">
                          {item.label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className={`ml-auto w-full max-w-[520px] rounded-[24px] p-4 shadow-2xl sm:rounded-[28px] sm:p-5 md:bg-white md:p-6 ${cardBg}`}>
                <h2 className={`text-[22px] font-bold leading-tight sm:text-[26px] md:text-[30px] ${headingText}`}>
                  {data?.enquirySection?.heading || "Get in touch with us"}
                </h2>

                <p className={`mt-2 text-sm leading-6 sm:text-base ${mutedText}`}>
                  {data?.enquirySection?.subtitle ||
                    "Share your details and our team will connect with you shortly."}
                </p>

                <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                  <div>
                    <label className={`mb-1.5 block text-sm font-semibold ${labelText}`}>
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className={`mb-1.5 block text-sm font-semibold ${labelText}`}>
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email id"
                      value={formData.email}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className={`mb-1.5 block text-sm font-semibold ${labelText}`}>
                      Phone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className={`mb-1.5 block text-sm font-semibold ${labelText}`}>
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      placeholder="Enter your city"
                      value={formData.city}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={`mb-1.5 block text-sm font-semibold ${labelText}`}>
                      Investment Range
                    </label>
                    <select
                      name="investmentRange"
                      value={formData.investmentRange}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    >
                      <option value="">Select your investment range</option>
                      <option value="1-2 Lakh">1-2 Lakh</option>
                      <option value="2-3 Lakh">2-3 Lakh</option>
                      <option value="3-4 Lakh">3-4 Lakh</option>
                      <option value="4-5 Lakh">4-5 Lakh</option>
                    </select>
                  </div>

                  <div>
                    <label className={`mb-1.5 block text-sm font-semibold ${labelText}`}>
                      Message
                    </label>
                    <textarea
                      name="message"
                      rows="3"
                      placeholder="Tell us a bit about your interest"
                      value={formData.message}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-xl bg-[#072b57] px-5 py-3 text-base font-semibold text-white transition hover:bg-[#0b5c8e] disabled:opacity-60 sm:py-3.5 sm:text-lg md:rounded-md"
                  >
                    {submitting ? "Submitting..." : "SEND"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* WHY FRANCHISE */}
        <section className={`${sectionBg} py-10 sm:py-12 md:py-16 lg:py-20`}>
          <div className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-10">
            <div className="mx-auto max-w-5xl text-center">
              <p className="text-sm font-semibold text-[#13b7dc] sm:text-lg md:text-xl md:text-[#0b5c8e]">
                {data?.whyFranchise?.heading}
              </p>
              <h2 className={`mt-2.5 text-[28px] font-bold leading-[1.15] sm:text-[36px] md:mt-3 md:text-5xl ${headingText}`}>
                {data?.whyFranchise?.title}
              </h2>
            </div>

            <div className="mt-8 grid gap-4 sm:mt-12 md:grid-cols-2 xl:mt-14 xl:grid-cols-4">
              {(data?.whyFranchise?.items || []).map((item, index) => (
                <div
                  key={index}
                  className={`rounded-[22px] p-5 text-center shadow-sm md:border-0 md:bg-transparent md:px-2 md:shadow-none ${cardBg}`}
                >
                  <div className="mx-auto flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-[#eef3f8] text-3xl shadow-sm sm:h-24 sm:w-24 sm:text-5xl">
                    {item.image ? (
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.title}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <span>{whyIcons[index] || "✨"}</span>
                    )}
                  </div>

                  <h3 className={`mt-4 text-[21px] font-bold leading-tight sm:text-[28px] md:text-[32px] ${headingText}`}>
                    {item.title}
                  </h3>

                  <p className={`mt-2 text-sm leading-6 sm:text-[16px] md:mt-4 md:text-[17px] md:leading-8 ${bodyText}`}>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BRAND STATS / VISUAL */}
        <section className={`${sectionAltBg} py-10 sm:py-12 md:py-16 lg:py-20`}>
          <div className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-10">
            <div className="mx-auto max-w-5xl text-center">
              <p className="text-sm font-semibold text-[#13b7dc] sm:text-lg md:text-xl md:text-[#0b5c8e]">
                {data?.brandStats?.heading}
              </p>
              <h2 className={`mt-2.5 text-[28px] font-bold leading-[1.15] sm:text-[36px] md:mt-3 md:text-5xl ${headingText}`}>
                {data?.brandStats?.title}
              </h2>
            </div>

            <div className="mt-8 grid items-center gap-6 sm:mt-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10 xl:mt-14">
              <div className="w-full">
                {data?.brandStats?.image ? (
                  <img
                    src={getImageUrl(data.brandStats.image)}
                    alt="Brand visual"
                    className="h-[230px] w-full rounded-[22px] object-contain sm:h-[320px] md:h-[420px] lg:h-[520px] xl:h-[550px]"
                  />
                ) : (
                  <div className={`flex h-[230px] flex-col items-center justify-center rounded-[22px] px-6 text-center sm:h-[320px] md:h-[420px] lg:h-[460px] ${cardBg}`}>
                    <div className="text-5xl sm:text-7xl">🗺️</div>
                    <h3 className={`mt-4 text-xl font-bold sm:text-2xl md:text-3xl ${headingText}`}>
                      Brand Growth Visual
                    </h3>
                    <p className={`mt-3 max-w-md text-sm leading-6 sm:text-base sm:leading-7 ${mutedText}`}>
                      Yaha admin se relevant image aayegi.
                    </p>
                  </div>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                {(data?.brandStats?.stats || []).map((item, index) => (
                  <div
                    key={index}
                    className={`rounded-[18px] p-5 shadow-sm sm:rounded-[22px] sm:p-6 ${cardBg}`}
                  >
                    <div className="flex items-start gap-4 md:block">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#eef3f8] text-2xl sm:h-14 sm:w-14 sm:text-3xl md:mb-4">
                        {item.image ? (
                          <img
                            src={getImageUrl(item.image)}
                            alt={item.title}
                            className="h-full w-full rounded-xl object-cover"
                          />
                        ) : (
                          <span>{supportIcons[index] || "⭐"}</span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1 md:block">
                        <h3 className={`text-[18px] font-bold leading-snug sm:text-[20px] md:text-2xl ${headingText}`}>
                          {item.title}
                        </h3>

                        <p className={`mt-1 text-sm leading-6 sm:text-[16px] sm:leading-7 ${bodyText}`}>
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FACTS SECTION */}
        {(data?.factsSection?.heading ||
          (data?.factsSection?.stats || []).length > 0) && (
          <section
            className="relative overflow-hidden py-10 sm:py-12 md:py-16 lg:py-20"
            style={{
              backgroundImage: factsBg
                ? `linear-gradient(rgba(7,43,87,0.38), rgba(7,43,87,0.42)), url("${factsBg}")`
                : `linear-gradient(rgba(7,43,87,0.48), rgba(7,43,87,0.48)), url("https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600&auto=format&fit=crop")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="relative z-10 mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-10">
              <div className="text-center">
                <h2 className="text-[28px] font-bold leading-tight text-white sm:text-[34px] md:text-5xl">
                  {data?.factsSection?.heading || "Facts About Our Institute"}
                </h2>
                <div className="mx-auto mt-4 h-[4px] w-24 bg-[#facc15] sm:mt-5 sm:w-40" />
              </div>

              {!!(data?.factsSection?.stats || []).length && (
                <div className="mt-9 grid grid-cols-2 gap-4 text-center sm:mt-12 md:mt-14 md:grid-cols-4 md:gap-8">
                  {(data?.factsSection?.stats || []).map((item, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-white/15 bg-black/25 p-4 text-white backdrop-blur-sm md:border-0 md:bg-transparent md:p-0"
                    >
                      <div className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
                        <CountUpValue value={item.value} />
                      </div>
                      <div className="mt-2 text-sm font-medium leading-snug text-white/95 sm:text-base md:text-xl">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* FOUNDER MESSAGE */}
        <section className={`${sectionBg} py-10 sm:py-12 md:py-16 lg:py-20`}>
          <div className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-10">
            <div className="grid items-center gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10">
              <div className="overflow-hidden rounded-[22px] border border-[var(--mc-border)] bg-[var(--mc-bg-card)] shadow-xl md:border-[8px] md:border-white md:bg-[#eef3f8]">
                {data?.founder?.image ? (
                  <img
                    src={getImageUrl(data.founder.image)}
                    alt={data?.founder?.name}
                    className="h-[280px] w-full object-cover sm:h-[420px] lg:h-[560px]"
                  />
                ) : (
                  <div className="flex h-[280px] items-center justify-center bg-gradient-to-br from-[#dbeafe] to-[#f8fafc] text-6xl sm:h-[420px] sm:text-7xl lg:h-[560px] lg:text-8xl">
                    👨‍💼
                  </div>
                )}
              </div>

              <div className={`rounded-[22px] p-5 md:rounded-none md:bg-transparent md:p-0 ${cardBg}`}>
                <p className="text-sm font-semibold text-[#13b7dc] sm:text-lg md:text-xl md:text-[#0b5c8e]">
                  {data?.founder?.heading}
                </p>

                <h2 className={`mt-2 text-[28px] font-bold leading-tight sm:text-[36px] md:mt-4 md:text-5xl ${headingText}`}>
                  {data?.founder?.name}
                </h2>

                <p className="mt-2 text-base font-medium text-[#13b7dc] sm:text-xl md:text-[#0b5c8e]">
                  {data?.founder?.designation}
                </p>

                <div className={`mt-4 whitespace-pre-line text-sm leading-7 sm:text-[16px] sm:leading-8 md:mt-8 md:text-[17px] md:leading-9 ${bodyText}`}>
                  {data?.founder?.message}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* VIDEO */}
        {(data?.videoSection?.youtubeUrl || data?.videoSection?.thumbnail) && (
          <section className={`${sectionAltBg} py-10 sm:py-12 md:py-16 lg:py-20`}>
            <div className="mx-auto max-w-[1200px] px-4 text-center sm:px-6 lg:px-10">
              <p className="text-sm font-semibold text-[#13b7dc] sm:text-lg md:text-xl md:text-[#0b5c8e]">
                {data?.videoSection?.heading}
              </p>

              <h2 className={`mt-2.5 text-[28px] font-bold leading-[1.15] sm:text-[36px] md:mt-3 md:text-5xl ${headingText}`}>
                {data?.videoSection?.title}
              </h2>

              <div className="mt-8 overflow-hidden rounded-[18px] border border-[var(--mc-border)] bg-black shadow-2xl sm:mt-10 md:border-slate-300">
                {data?.videoSection?.youtubeUrl ? (
                  <iframe
                    className="aspect-video w-full"
                    src={getYoutubeEmbedUrl(data.videoSection.youtubeUrl)}
                    title="Franchise Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <img
                    src={getImageUrl(data.videoSection.thumbnail)}
                    alt="Franchise video thumbnail"
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
            </div>
          </section>
        )}

        {/* IDEAL PARTNER */}
        <section className={`${sectionBg} py-10 sm:py-12 md:py-16 lg:py-20`}>
          <div className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-10">
            <div className="mx-auto max-w-5xl text-center">
              <p className="text-sm font-semibold text-[#13b7dc] sm:text-lg md:text-xl md:text-[#0b5c8e]">
                {data?.idealPartner?.heading}
              </p>

              <h2 className={`mt-2.5 text-[28px] font-bold leading-[1.15] sm:text-[36px] md:mt-3 md:text-5xl ${headingText}`}>
                {data?.idealPartner?.title}
              </h2>
            </div>

            <div className="mt-8 grid gap-4 sm:mt-12 md:grid-cols-2 xl:mt-14 xl:grid-cols-4">
              {(data?.idealPartner?.items || []).map((item, index) => (
                <div
                  key={index}
                  className={`rounded-[22px] p-5 text-center shadow-sm md:border-0 md:bg-transparent md:px-4 md:shadow-none ${cardBg}`}
                >
                  <div className="mx-auto flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-[#eef3f8] text-3xl sm:h-24 sm:w-24 sm:text-5xl">
                    {item.image ? (
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.title}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <span>{partnerIcons[index] || "✅"}</span>
                    )}
                  </div>

                  <h3 className={`mt-4 text-[21px] font-bold leading-tight sm:text-[28px] md:text-[32px] ${headingText}`}>
                    {item.title}
                  </h3>

                  <p className={`mt-2 text-sm leading-6 sm:text-[16px] md:mt-4 md:text-[17px] md:leading-8 ${bodyText}`}>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DELIVERY MODES */}
        <section className="bg-[#07111a] py-10 text-white sm:py-12 md:bg-[#1d1d1d] md:py-16 lg:py-20">
          <div className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-10">
            <div className="mx-auto max-w-5xl text-center">
              <p className="text-sm font-semibold text-[#facc15] sm:text-lg md:text-xl">
                {data?.deliveryModes?.heading}
              </p>

              <h2 className="mt-2.5 text-[28px] font-bold leading-[1.15] sm:text-[36px] md:mt-3 md:text-5xl">
                {data?.deliveryModes?.title}
              </h2>
            </div>

            <div className="mt-8 grid gap-4 sm:mt-12 md:grid-cols-2 md:gap-6 xl:mt-14">
              {(data?.deliveryModes?.items || []).map((item, index) => (
                <div
                  key={index}
                  className="rounded-[22px] border border-white/10 bg-white/[0.06] p-5 text-white shadow-lg sm:p-6 md:rounded-md md:bg-white md:p-8 md:text-[#07111a]"
                >
                  <div className="grid gap-5 sm:grid-cols-[140px_1fr] sm:gap-6 md:grid-cols-[180px_1fr]">
                    <div className="flex h-[150px] items-center justify-center overflow-hidden rounded-xl bg-white/10 text-5xl sm:h-[140px] sm:text-6xl md:h-[160px] md:rounded-md md:bg-[#eef3f8]">
                      {item.image ? (
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span>{deliveryIcons[index] || "💻"}</span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-[22px] font-bold leading-tight text-white sm:text-[26px] md:text-3xl md:text-[#072b57]">
                        {item.title}
                      </h3>

                      <p className="mt-3 text-sm leading-7 text-white/75 sm:text-[16px] md:mt-4 md:text-[17px] md:leading-8 md:text-slate-700">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SUPPORT SYSTEM */}
        <section className={`${sectionAltBg} py-10 sm:py-12 md:py-16 lg:py-20`}>
          <div className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-10">
            <div className="mx-auto max-w-5xl text-center">
              <p className="text-sm font-semibold text-[#13b7dc] sm:text-lg md:text-xl md:text-[#0b5c8e]">
                {data?.supportSystem?.heading}
              </p>

              <h2 className={`mt-2 text-[26px] font-bold leading-[1.14] sm:text-[34px] md:mt-3 md:text-5xl ${headingText}`}>
                {data?.supportSystem?.title}
              </h2>
            </div>

            <div className="mt-8 grid gap-4 sm:mt-12 md:grid-cols-2 xl:mt-14 xl:grid-cols-3 xl:gap-6">
              {(data?.supportSystem?.items || []).map((item, index) => (
                <div
                  key={index}
                  className={`rounded-[18px] p-5 shadow-sm sm:rounded-[22px] sm:p-6 ${cardBg}`}
                >
                  <div className="flex items-start gap-4 md:block">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#eef3f8] text-2xl sm:h-14 sm:w-14 sm:text-3xl md:mb-4">
                      {item.image ? (
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.title}
                          className="h-full w-full rounded-xl object-cover"
                        />
                      ) : (
                        <span>{supportIcons[index] || "⭐"}</span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1 md:block">
                      <h3 className={`text-[18px] font-bold leading-snug sm:text-[20px] md:text-2xl ${headingText}`}>
                        {item.title}
                      </h3>

                      <p className={`mt-2 text-sm leading-6 sm:text-[15px] sm:leading-7 md:text-[16px] ${bodyText}`}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROCESS */}
        <section className={`${sectionBg} py-10 sm:py-12 md:py-16 lg:py-20`}>
          <div className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-10">
            <div className="mx-auto max-w-5xl text-center">
              <p className="text-sm font-semibold text-[#13b7dc] sm:text-lg md:text-xl md:text-[#0b5c8e]">
                {data?.processSection?.heading}
              </p>

              <h2 className={`mt-2.5 text-[28px] font-bold leading-[1.15] sm:text-[36px] md:mt-3 md:text-5xl ${headingText}`}>
                {data?.processSection?.title}
              </h2>
            </div>

            <div className="mt-8 grid gap-4 sm:mt-12 md:grid-cols-2 xl:mt-14 xl:grid-cols-3 xl:gap-6">
              {(data?.processSection?.items || []).map((item, index) => (
                <div
                  key={index}
                  className="rounded-[20px] border border-[var(--mc-border)] bg-[var(--mc-bg-card)] p-5 shadow-sm md:min-h-[250px] md:rounded-md md:border-0 md:bg-[#eef5fb] md:p-7"
                >
                  <div className="flex items-start gap-3 md:block">
                    <div className="shrink-0">
                      <div className="text-[30px] font-bold leading-none text-[#13b7dc] sm:text-4xl md:text-5xl md:text-[#072b57]">
                        {item.step}
                      </div>

                      <div className="mt-2 h-[3px] w-14 bg-[#facc15] sm:w-16 md:w-24" />
                    </div>

                    <div className="min-w-0 flex-1 md:block">
                      <h3 className={`text-[17px] font-bold leading-snug sm:text-[20px] md:mt-8 md:text-2xl ${headingText}`}>
                        {item.title}
                      </h3>

                      <p className={`mt-2 text-sm leading-6 sm:text-[15px] sm:leading-7 md:mt-4 md:text-[16px] md:leading-8 ${bodyText}`}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="bg-[var(--mc-bg-main)] md:bg-white">
          <FAQSection />
        </div>

        {/* LOGOS */}
        {!!data?.logosSection?.logos?.length && (
          <section className="overflow-hidden bg-[var(--mc-surface-gradient)] py-10 sm:py-12 md:bg-[#f7f7f2] md:py-16">
            <div className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-10">
              <div className="mx-auto max-w-5xl text-center">
                <p className="text-sm font-semibold text-[#13b7dc] sm:text-lg md:text-xl md:text-[#0b5c8e]">
                  {data?.logosSection?.heading}
                </p>

                <h2 className={`mt-2.5 text-[28px] font-bold leading-[1.15] sm:text-[36px] md:mt-3 md:text-5xl ${headingText}`}>
                  {data?.logosSection?.title}
                </h2>
              </div>

              <div className="logo-mask-fade mt-8 space-y-4 sm:mt-12 sm:space-y-6">
                {!!topLogos.length && (
                  <div className="overflow-hidden">
                    <div className="animate-logo-marquee flex w-max gap-4 sm:gap-6">
                      {[...topLogos, ...topLogos].map((logo, index) => (
                        <div
                          key={`top-${index}`}
                          className="flex h-[86px] min-w-[160px] items-center justify-center rounded-xl border border-[var(--mc-border)] bg-[var(--mc-bg-card)] p-4 shadow-sm sm:h-[120px] sm:min-w-[220px] sm:p-5 md:rounded-md md:border-slate-200 md:bg-white"
                        >
                          <img
                            src={safeLogoUrl(logo)}
                            alt={`logo-top-${index}`}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!!bottomLogos.length && (
                  <div className="overflow-hidden">
                    <div className="animate-logo-marquee-reverse flex w-max gap-4 sm:gap-6">
                      {[...bottomLogos, ...bottomLogos].map((logo, index) => (
                        <div
                          key={`bottom-${index}`}
                          className="flex h-[86px] min-w-[160px] items-center justify-center rounded-xl border border-[var(--mc-border)] bg-[var(--mc-bg-card)] p-4 shadow-sm sm:h-[120px] sm:min-w-[220px] sm:p-5 md:rounded-md md:border-slate-200 md:bg-white"
                        >
                          <img
                            src={safeLogoUrl(logo)}
                            alt={`logo-bottom-${index}`}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </div>

      <div className="hidden md:block">
        <Footer />
      </div>

      <div className="md:hidden">
        <MobileBottomNav />
      </div>
    </>
  );
}

export default Franchise;