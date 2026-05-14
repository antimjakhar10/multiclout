import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { API } from "../utils/api";

function RefundPolicy() {
  const [data, setData] = useState(null);

  useEffect(() => {
  axios.get(`${API}/site-settings`).then((res) => {
    if (res.data.success) {
      setData(res.data.settings.refundPolicy);
    }
  });
}, []);

  const contentBlocks = useMemo(() => {
    const content = data?.content || "";

    const lines = content
      .split("\n")
      .map((line) => line.replace(/\t/g, "    ").trim())
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
      if (isBullet(line) || isNumbered(line)) return false;

      return (
        line.endsWith(":") ||
        /^[A-Z][A-Za-z0-9\s&()/,-]{2,60}$/.test(line)
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
      <Navbar />

      <div className="min-h-screen bg-white">
        <div className="border-b border-slate-200 bg-slate-50">
          <div className="mx-auto w-full max-w-[1380px] px-4 py-14 sm:px-6 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#167a7a]">
              Legal
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#07111a] sm:text-4xl md:text-5xl">
              {data?.title || "Refund Policy"}
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
              Please review our refund and cancellation terms carefully before making a purchase.
            </p>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[1380px] px-4 py-10 sm:px-6 md:py-12 lg:px-8">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
            {contentBlocks.length === 0 ? (
              <p className="text-base text-slate-500">
                Refund Policy content not available.
              </p>
            ) : (
              <div className="space-y-5">
                {contentBlocks.map((block, index) => {
                  if (block.type === "heading") {
                    return (
                      <h2
                        key={index}
                        className="pt-2 text-[22px] font-semibold leading-tight text-[#0b4f8a] sm:text-[24px]"
                      >
                        {block.text}
                      </h2>
                    );
                  }

                  if (block.type === "ul") {
                    return (
                      <ul
                        key={index}
                        className="list-disc space-y-2 pl-6 text-[16px] leading-8 text-slate-700 marker:text-[#167a7a]"
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
                        className="list-decimal space-y-3 pl-6 text-[16px] leading-8 text-slate-700 marker:font-semibold marker:text-[#167a7a]"
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
                      className="text-[16px] leading-8 text-slate-700"
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

      <Footer />
    </>
  );
}

export default RefundPolicy;