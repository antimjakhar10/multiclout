import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import MobileBottomNav from "./videos/MobileBottomNav";
import MobileAppHeader from "./videos/MobileAppHeader";
import { API } from "../utils/api";

const decodeHtml = (value = "") => {
  if (typeof window === "undefined") return value;
  const txt = document.createElement("textarea");
  txt.innerHTML = value;
  return txt.value;
};

const normalizeContent = (content = "") =>
  decodeHtml(content)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|h1|h2|h3|h4|li)>/gi, "\n")
    .replace(/<li>/gi, "• ")
    .replace(/<[^>]*>/g, "")
    .replace(/\r/g, "\n");

const buildBlocks = (content = "") => {
  const lines = normalizeContent(content)
    .split("\n")
    .map((line) => line.replace(/\t/g, " ").trim())
    .filter(Boolean);

  const blocks = [];
  let bullets = [];
  let numbers = [];

  const flushBullets = () => {
    if (bullets.length) blocks.push({ type: "ul", items: [...bullets] });
    bullets = [];
  };

  const flushNumbers = () => {
    if (numbers.length) blocks.push({ type: "ol", items: [...numbers] });
    numbers = [];
  };

  const isBullet = (line) => /^[-•*]\s+/.test(line);
  const isNumbered = (line) => /^\d+[\.\)]\s+/.test(line);

  const isHeading = (line) => {
    if (isBullet(line) || isNumbered(line)) return false;
    if (line.length > 90) return false;

    return (
      line.endsWith(":") ||
      /^[A-Z][A-Za-z0-9\s&()/,'’-]{2,70}$/.test(line)
    );
  };

  lines.forEach((line) => {
    if (isBullet(line)) {
      flushNumbers();
      bullets.push(line.replace(/^[-•*]\s+/, ""));
      return;
    }

    if (isNumbered(line)) {
      flushBullets();
      numbers.push(line.replace(/^\d+[\.\)]\s+/, ""));
      return;
    }

    flushBullets();
    flushNumbers();

    blocks.push(
      isHeading(line)
        ? { type: "heading", text: line.replace(/:$/, "") }
        : { type: "paragraph", text: line }
    );
  });

  flushBullets();
  flushNumbers();

  return blocks;
};

function LegalPageLayout({
  settingKey,
  fallbackTitle,
  subtitle,
  emptyMessage,
}) {
  const [data, setData] = useState(null);

  useEffect(() => {
  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${API}/site-settings`);

      if (res.data.success) {
        setData(res.data.settings?.[settingKey] || null);
      }
    } catch (error) {
      console.error("Failed to fetch legal page:", error);
    }
  };

  fetchSettings();
}, [settingKey]);

  const blocks = useMemo(() => buildBlocks(data?.content || ""), [data]);

  return (
    <>
      <div className="hidden md:block">
        <Navbar />
      </div>

      <div className="md:hidden">
        <MobileAppHeader />
      </div>

      <main className="min-h-screen bg-[var(--mc-bg-main)] pb-24 text-[var(--mc-text-main)] md:bg-[#f8fafc] md:pb-0 md:text-[#07111a]">
        <section className="border-b border-[var(--mc-border)] bg-[var(--mc-surface-gradient)] md:border-slate-200 md:bg-white">
          <div className="mx-auto w-full max-w-[1320px] px-4 py-10 sm:px-6 md:py-16 lg:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#13b7dc] md:text-[#167a7a]">
              Legal
            </p>

            <h1 className="mt-4 text-[34px] font-extrabold leading-tight tracking-tight sm:text-5xl md:text-[56px]">
              {data?.title || fallbackTitle}
            </h1>

            <p className="mt-5 max-w-3xl text-[15px] leading-8 text-[var(--mc-text-soft)] md:text-lg md:text-slate-600">
              {subtitle}
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1320px] px-4 py-7 sm:px-6 md:py-14 lg:px-8">
          <div className="rounded-[28px] border border-[var(--mc-border)] bg-[var(--mc-bg-card)] p-5 shadow-sm sm:p-8 md:border-slate-200 md:bg-white md:p-10 lg:p-12">
            {!blocks.length ? (
              <p className="text-base text-[var(--mc-text-soft)] md:text-slate-500">
                {emptyMessage}
              </p>
            ) : (
              <div className="legal-content space-y-6">
                {blocks.map((block, index) => {
                  if (block.type === "heading") {
                    return (
                      <h2
                        key={index}
                        className="pt-3 text-[23px] font-extrabold leading-snug text-[#0b5c8e] sm:text-[28px]"
                      >
                        {block.text}
                      </h2>
                    );
                  }

                  if (block.type === "ul") {
                    return (
                      <ul
                        key={index}
                        className="list-disc space-y-3 pl-7 text-[15px] leading-8 text-[var(--mc-text-soft)] marker:text-[#167a7a] md:text-[17px] md:leading-9 md:text-slate-700"
                      >
                        {block.items.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    );
                  }

                  if (block.type === "ol") {
                    return (
                      <ol
                        key={index}
                        className="list-decimal space-y-3 pl-7 text-[15px] leading-8 text-[var(--mc-text-soft)] marker:font-bold marker:text-[#167a7a] md:text-[17px] md:leading-9 md:text-slate-700"
                      >
                        {block.items.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ol>
                    );
                  }

                  return (
                    <p
                      key={index}
                      className="text-[15px] leading-8 text-[var(--mc-text-soft)] md:text-[17px] md:leading-9 md:text-slate-700"
                    >
                      {block.text}
                    </p>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <div className="hidden md:block">
        <Footer />
      </div>

      <div className="md:hidden">
        <MobileBottomNav />
      </div>
    </>
  );
}

export default LegalPageLayout;