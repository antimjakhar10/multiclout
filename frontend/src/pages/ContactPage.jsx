import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaCheckCircle,
  FaHeadphones,
  FaShieldAlt,
  FaPlus,
  FaMinus,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MobileBottomNav from "../components/videos/MobileBottomNav";
import MobileAppHeader from "../components/videos/MobileAppHeader";
import { API } from "../utils/api";

const supportIcons = [FaCheckCircle, FaHeadphones, FaShieldAlt];
const topCardGradients = [
  "from-[#24152f] via-[#191227] to-[#131827]",
  "from-[#0f1f38] via-[#101828] to-[#0b1c2f]",
  "from-[#2c1422] via-[#1a1424] to-[#111827]",
];

function ContactPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const cardBg =
    "border border-[var(--mc-border)] bg-[var(--mc-bg-card)] text-[var(--mc-text-main)] md:border-white/10 md:bg-[#050d18] md:text-white";
  const headingText = "text-[var(--mc-text-main)] md:text-white";
  const bodyText = "text-[var(--mc-text-soft)] md:text-slate-300";
  const mutedText = "text-[var(--mc-text-soft)] md:text-slate-400";
  const inputClass =
    "rounded-2xl border border-[var(--mc-border)] bg-[var(--mc-bg-main)] px-4 py-4 text-[var(--mc-text-main)] outline-none placeholder:text-[var(--mc-text-soft)] focus:border-[#13b7dc] md:border-white/10 md:bg-[#0b1824] md:text-white md:placeholder:text-slate-500";

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${API}/site-settings`);
      if (res.data.success) {
        setSettings(res.data.settings);
      }
    } catch (error) {
      console.error("Failed to fetch site settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      const res = await axios.post(`${API}/site-settings/contact-enquiry`, form);

      if (res.data.success) {
        alert("Enquiry submitted successfully.");
        setForm({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      }
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to submit enquiry.");
    } finally {
      setSubmitting(false);
    }
  };

  const contact = settings?.contactPage;

  return (
    <>
      <div className="hidden md:block">
        <Navbar />
      </div>

      <div className="md:hidden">
        <MobileAppHeader />
      </div>

      <div className="min-h-screen bg-[var(--mc-bg-main)] pb-24 text-[var(--mc-text-main)] md:bg-[#020817] md:pb-0 md:pt-[88px] md:text-white">
        {loading ? (
          <div className="px-6 py-20">
            <div className="mx-auto max-w-[1450px] text-[var(--mc-text-soft)] md:text-white">
              Loading...
            </div>
          </div>
        ) : (
          <div className="px-4 pb-16 pt-5 sm:px-6 md:pt-0 lg:px-10 xl:px-12">
            <div className="mx-auto max-w-[1450px]">
              {/* HERO */}
              <section className="rounded-[26px] border border-[#7c3aed]/25 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.18),transparent_35%),linear-gradient(135deg,#2a1a46_0%,#1a1630_45%,#07101d_100%)] px-4 py-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)] sm:px-8 sm:py-12 md:rounded-[32px] lg:px-10 lg:py-14">
                <div className="mx-auto max-w-5xl text-center">
                  <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-medium text-white/85 sm:text-xs">
                    {contact?.badge || "Multiclout • Official Customer Support"}
                  </span>

                  <h1 className="mt-5 text-[32px] font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                    {contact?.heroTitle || "Contact Support"}
                  </h1>

                  <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                    {contact?.heroDescription ||
                      "Get help from our official support team for account, learning, app and business related queries."}
                  </p>

                  <div className="mx-auto mt-7 grid max-w-[900px] gap-3 md:mt-8 md:grid-cols-[0.82fr_1.18fr] md:gap-4">
                    <a
                      href={`tel:${contact?.callValue || "+917206123452"}`}
                      className="inline-flex min-h-[58px] w-full items-center justify-center gap-3 rounded-2xl bg-white px-4 py-4 text-sm font-semibold text-black transition hover:scale-[1.01] sm:text-base"
                    >
                      <FaPhoneAlt className="shrink-0 text-black" />
                      <span className="text-black">
                        {contact?.callLabel || "Call"}{" "}
                        {contact?.callValue || "+91 7206123452"}
                      </span>
                    </a>

                    <a
                      href={`mailto:${contact?.emailValue || "support@multiclout.com"}`}
                      className="inline-flex min-h-[58px] w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm font-semibold text-white transition hover:bg-white/10 sm:text-base"
                    >
                      <FaEnvelope className="shrink-0" />
                      <span className="truncate">
                        {contact?.emailLabel || "Email"}{" "}
                        {contact?.emailValue || "support@multiclout.com"}
                      </span>
                    </a>
                  </div>

                  <div className="mt-7 grid gap-3 md:mt-8 md:grid-cols-[1fr_1.35fr_1fr] md:gap-4">
                    {(contact?.topCards || []).map((item, index) => (
                      <div
                        key={index}
                        className={`min-h-[140px] rounded-[22px] border border-white/10 bg-gradient-to-br ${
                          topCardGradients[index % topCardGradients.length]
                        } px-5 py-5 text-left shadow-[0_10px_30px_rgba(0,0,0,0.22)] md:min-h-[180px] md:rounded-[24px] md:px-6 md:py-7`}
                      >
                        <p className="text-sm font-semibold text-slate-300">
                          {item.title}
                        </p>

                        <h3 className="mt-3 overflow-hidden text-ellipsis whitespace-nowrap text-[22px] font-bold leading-[1.15] text-white sm:text-[28px] xl:text-[32px]">
                          {item.value}
                        </h3>

                        {item.subtitle && (
                          <p className="mt-3 text-sm text-slate-400">
                            {item.subtitle}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* MAIN GRID */}
              <div className="mt-6 grid gap-6 md:mt-8 md:gap-8 lg:grid-cols-[0.78fr_1.22fr]">
                {/* LEFT SIDE */}
                <div className="space-y-5">
                  <div className="rounded-[24px] border border-[var(--mc-border)] bg-[var(--mc-bg-card)] p-5 shadow-[0_12px_34px_rgba(0,0,0,0.10)] sm:p-6 md:rounded-[26px] md:border-[#7c3aed]/20 md:bg-[linear-gradient(135deg,rgba(64,18,52,0.28),rgba(9,16,29,0.92))] md:shadow-[0_12px_34px_rgba(0,0,0,0.24)]">
                    <h2 className={`text-2xl font-semibold sm:text-3xl ${headingText}`}>
                      {contact?.companyTitle || "Company"}
                    </h2>

                    <div className="mt-4 rounded-[22px] border border-[var(--mc-border)] bg-[var(--mc-bg-main)] p-5 sm:p-6 md:border-white/10 md:bg-[linear-gradient(135deg,rgba(69,22,54,0.28),rgba(20,11,26,0.9))]">
                      <h3 className={`text-2xl font-bold sm:text-3xl ${headingText}`}>
                        {contact?.companyName || "Multiclout Private Limited"}
                      </h3>
                      <p className={`mt-3 whitespace-pre-line text-base sm:text-lg ${bodyText}`}>
                        {contact?.companyAddress || "India"}
                      </p>
                    </div>
                  </div>

                  {(contact?.supportPoints || []).map((item, index) => {
                    const Icon = supportIcons[index % supportIcons.length];

                    return (
                      <div
                        key={index}
                        className={`rounded-[22px] p-5 shadow-[0_10px_28px_rgba(0,0,0,0.10)] sm:p-6 md:shadow-[0_10px_28px_rgba(0,0,0,0.20)] ${cardBg}`}
                      >
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--mc-chip-bg)] text-[var(--mc-text-main)] md:bg-white/5 md:text-white">
                          <Icon />
                        </div>

                        <h3 className={`mt-4 text-2xl font-semibold sm:text-3xl ${headingText}`}>
                          {item.title}
                        </h3>

                        <p className={`mt-2 text-base sm:text-lg ${mutedText}`}>
                          {item.subtitle}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* RIGHT SIDE */}
                <div className="space-y-6">
                  <div className="rounded-[24px] border border-[var(--mc-border)] bg-[var(--mc-bg-card)] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.10)] sm:p-7 md:rounded-[26px] md:border-[#60a5fa]/25 md:bg-[linear-gradient(135deg,rgba(32,52,90,0.88),rgba(19,25,45,0.94),rgba(34,17,44,0.82))] md:shadow-[0_16px_40px_rgba(0,0,0,0.25)]">
                    <h2 className={`text-2xl font-semibold sm:text-3xl ${headingText}`}>
                      {contact?.faqsTitle || "Frequently asked questions"}
                    </h2>

                    <p className={`mt-2 text-base sm:text-lg ${bodyText}`}>
                      {contact?.faqsSubtitle || "Click a question to expand."}
                    </p>

                    <div className="mt-6 divide-y divide-[var(--mc-border)] md:divide-white/10">
                      {(contact?.faqs || []).map((faq, index) => {
                        const isOpen = openFaq === index;

                        return (
                          <div key={index} className="py-5">
                            <button
                              onClick={() => setOpenFaq(isOpen ? -1 : index)}
                              className="flex w-full items-start justify-between gap-4 text-left"
                            >
                              <span className={`pr-2 text-base font-semibold sm:text-2xl ${headingText}`}>
                                {faq.question}
                              </span>

                              <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--mc-border)] bg-[var(--mc-chip-bg)] text-sm text-[var(--mc-text-main)] md:h-10 md:w-10 md:border-white/10 md:bg-white/5 md:text-white">
                                {isOpen ? <FaMinus /> : <FaPlus />}
                              </span>
                            </button>

                            {isOpen ? (
                              <p className={`mt-4 max-w-3xl text-sm leading-7 sm:text-lg sm:leading-8 ${bodyText}`}>
                                {faq.answer}
                              </p>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-[var(--mc-border)] bg-[var(--mc-bg-card)] p-5 shadow-[0_14px_32px_rgba(0,0,0,0.10)] sm:p-7 md:rounded-[26px] md:border-white/10 md:bg-[#06101b] md:shadow-[0_14px_32px_rgba(0,0,0,0.20)]">
                    <h2 className={`text-2xl font-semibold sm:text-3xl ${headingText}`}>
                      Send us a message
                    </h2>

                    <p className={`mt-2 text-base sm:text-lg ${mutedText}`}>
                      Fill out the form and our team will get back to you.
                    </p>

                    <form
                      onSubmit={handleSubmit}
                      className="mt-6 grid gap-4 sm:grid-cols-2"
                    >
                      <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        value={form.name}
                        onChange={handleChange}
                        className={inputClass}
                        required
                      />

                      <input
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        value={form.email}
                        onChange={handleChange}
                        className={inputClass}
                        required
                      />

                      <input
                        type="text"
                        name="phone"
                        placeholder="Phone Number"
                        value={form.phone}
                        onChange={handleChange}
                        className={inputClass}
                      />

                      <input
                        type="text"
                        name="subject"
                        placeholder="Subject"
                        value={form.subject}
                        onChange={handleChange}
                        className={inputClass}
                      />

                      <textarea
                        name="message"
                        placeholder="Write your message..."
                        rows="6"
                        value={form.message}
                        onChange={handleChange}
                        className={`sm:col-span-2 ${inputClass}`}
                        required
                      />

                      <div className="sm:col-span-2">
                        <button
                          type="submit"
                          disabled={submitting}
                          className="w-full rounded-2xl bg-gradient-to-r from-[#7c3aed] via-[#8b5cf6] to-[#60a5fa] px-7 py-4 text-base font-semibold text-white transition hover:opacity-90 disabled:opacity-60 sm:w-auto"
                        >
                          {submitting ? "Submitting..." : "Submit Enquiry"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
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

export default ContactPage;