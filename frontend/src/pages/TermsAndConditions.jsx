import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MobileBottomNav from "../components/videos/MobileBottomNav";
import MobileAppHeader from "../components/videos/MobileAppHeader";
import { API } from "../utils/api";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function TermsAndConditions() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  const pageBg =
    "bg-[var(--mc-bg-main)] text-[var(--mc-text-main)] md:bg-white md:text-[#07111a]";
  const cardBg =
    "border border-[var(--mc-border)] bg-[var(--mc-bg-card)] text-[var(--mc-text-main)] md:border-slate-200 md:bg-white md:text-[#07111a]";
  const headingText = "text-[var(--mc-text-main)] md:text-[#07111a]";
  const bodyText = "text-[var(--mc-text-soft)] md:text-slate-700";
  const mutedText = "text-[var(--mc-text-soft)] md:text-slate-600";

  useEffect(() => {
    axios.get(`${API}/site-settings`).then((res) => {
      if (res.data.success) {
        setData(res.data.settings.termsAndConditions);
      }
    });
  }, []);

  const contentBlocks = useMemo(() => {
    const content = data?.content || "";
    const lines = content
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "");

    const blocks = [];
    let bulletBuffer = [];
    let numberBuffer = [];

    const flushBullets = () => {
      if (bulletBuffer.length) {
        blocks.push({ type: "ul", items: [...bulletBuffer] });
        bulletBuffer = [];
      }
    };

    const flushNumbers = () => {
      if (numberBuffer.length) {
        blocks.push({ type: "ol", items: [...numberBuffer] });
        numberBuffer = [];
      }
    };

    const isBullet = (line) => /^[-•*]\s+/.test(line);
    const isNumbered = (line) => /^\d+[\.\)]\s+/.test(line);

    const cleanBullet = (line) => line.replace(/^[-•*]\s+/, "").trim();
    const cleanNumber = (line) => line.replace(/^\d+[\.\)]\s+/, "").trim();

    const isHeadingLike = (line) => {
      if (line.length > 80) return false;
      if (isBullet(line) || isNumbered(line)) return false;

      return (
        line.endsWith(":") ||
        (!line.includes(".") &&
          line.split(" ").length <= 8 &&
          /[A-Za-z]/.test(line))
      );
    };

    lines.forEach((line) => {
      if (isBullet(line)) {
        flushNumbers();
        bulletBuffer.push(cleanBullet(line));
        return;
      }

      if (isNumbered(line)) {
        flushBullets();
        numberBuffer.push(cleanNumber(line));
        return;
      }

      flushBullets();
      flushNumbers();

      if (isHeadingLike(line)) {
        blocks.push({
          type: "heading",
          text: line.replace(/:$/, "").trim(),
        });
      } else {
        blocks.push({
          type: "paragraph",
          text: line,
        });
      }
    });

    flushBullets();
    flushNumbers();

    return blocks;
  }, [data]);

  return (
    <>
      <div className="hidden md:block">
        <Navbar />
      </div>

      <div className="md:hidden">
        <MobileAppHeader />
      </div>

      <div className={`min-h-screen pb-[110px] md:pb-0 ${pageBg}`}>
        <div className="border-b border-[var(--mc-border)] bg-[var(--mc-surface-gradient)] md:border-slate-200 md:bg-slate-50">
          <div className="mx-auto w-full max-w-[1320px] px-5 py-8 sm:px-6 md:px-8 md:py-14">
            {/* Mobile Back Button */}
<div className="mb-5 md:hidden">
  <button
    onClick={() => navigate(-1)}
    className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--mc-border)] bg-[var(--mc-bg-card)] text-[var(--mc-text-main)] transition hover:scale-105 active:scale-95"
  >
    <ArrowLeft size={20} />
  </button>
</div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#13b7dc] md:text-sm md:text-[#167a7a]">
              Legal
            </p>

            <h1
              className={`mt-3 text-[28px] leading-tight font-bold tracking-tight break-words sm:text-[34px] md:text-5xl ${headingText}`}
            >
              {data?.title || "Terms & Conditions"}
            </h1>

            <p
              className={`mt-4 max-w-3xl text-[15px] leading-7 break-words md:text-base ${mutedText}`}
            >
              Please read these terms carefully before using Multiclout
              services.
            </p>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[1320px] px-4 py-5 sm:px-6 md:px-8 md:py-12">
          <div
            className={`w-full overflow-hidden rounded-2xl p-4 shadow-sm sm:p-6 md:rounded-[28px] md:p-8 lg:p-10 ${cardBg}`}
          >
            {contentBlocks.length === 0 ? (
              <p className={`text-base ${mutedText}`}>
                Terms & Conditions content not available.
              </p>
            ) : (
              <div className="space-y-5 break-words overflow-hidden">
                {contentBlocks.map((block, index) => {
                  if (block.type === "heading") {
                    return (
                      <h2
                        key={index}
                        className="pt-2 text-[18px] leading-snug font-semibold break-words text-[#13b7dc] sm:text-[22px] md:text-[24px] md:text-[#0b4f8a]"
                      >
                        {block.text}
                      </h2>
                    );
                  }

                  if (block.type === "ul") {
                    return (
                      <ul
                        key={index}
                        className="list-disc space-y-2 pl-5 break-words text-[15px] leading-7 md:pl-6 md:leading-8 text-[var(--mc-text-soft)] marker:text-[#13b7dc] md:text-[16px] md:text-slate-700 md:marker:text-[#167a7a]"
                      >
                        {block.items.map((item, itemIndex) => (
                          <li key={itemIndex}>{item}</li>
                        ))}
                      </ul>
                    );
                  }

                  if (block.type === "ol") {
                    return (
                      <ol
                        key={index}
                        className="list-decimal space-y-2 pl-5 md:pl-6 text-[15px] leading-8 text-[var(--mc-text-soft)] marker:font-semibold marker:text-[#13b7dc] md:text-[16px] md:text-slate-700 md:marker:text-[#167a7a]"
                      >
                        {block.items.map((item, itemIndex) => (
                          <li key={itemIndex}>{item}</li>
                        ))}
                      </ol>
                    );
                  }

                  return (
                    <p
                      key={index}
                      className={`break-words text-[15px] leading-7 md:text-[16px] md:leading-8 ${bodyText}`}
                    >
                      {block.text}
                    </p>
                  );
                })}
              </div>
            )}
          </div>
        </div>
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

export default TermsAndConditions;
