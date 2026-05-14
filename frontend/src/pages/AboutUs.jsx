import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import {
  FiCheckCircle,
  FiTrendingUp,
  FiUsers,
  FiPlayCircle,
} from "react-icons/fi";
import MobileBottomNav from "../components/videos/MobileBottomNav";
import MobileAppHeader from "../components/videos/MobileAppHeader";

const highlights = [
  {
    title: "Structured Learning",
    desc: "Clear pathways, curated content, and focused learning journeys for better outcomes.",
    icon: <FiCheckCircle size={24} />,
  },
  {
    title: "Expert Mentorship",
    desc: "Learn from practical mentors who bring real experience, not just theory.",
    icon: <FiUsers size={24} />,
  },
  {
    title: "Growth Driven",
    desc: "Content, systems, and opportunities designed to help learners grow faster.",
    icon: <FiTrendingUp size={24} />,
  },
];

const pillars = [
  {
    number: "01",
    title: "Learning With Direction",
    desc: "We make learning simpler, more practical, and easier to follow with structured content and clear guidance.",
  },
  {
    number: "02",
    title: "Mentorship With Relevance",
    desc: "Our approach connects learners with expert-backed insights, tutorials, and real-world practical understanding.",
  },
  {
    number: "03",
    title: "Growth With Purpose",
    desc: "Multiclout is built to help students and professionals not only learn, but also improve confidence, execution, and outcomes.",
  },
];

const stats = [
  { value: "50K+", label: "Learners Reached" },
  { value: "100+", label: "Mentor-led Sessions" },
  { value: "6+", label: "States Presence" },
  { value: "1M+", label: "Video Views" },
];

function AboutUs() {
  const cardBg =
    "border border-[var(--mc-border)] bg-[var(--mc-bg-card)] text-[var(--mc-text-main)] md:border-slate-200 md:bg-white md:text-[#07111a]";
  const headingText = "text-[var(--mc-text-main)] md:text-[#072b57]";
  const bodyText = "text-[var(--mc-text-soft)] md:text-slate-700";
  const mutedText = "text-[var(--mc-text-soft)] md:text-slate-600";

  return (
    <>
      <div className="hidden md:block">
        <Navbar />
      </div>

      <div className="md:hidden">
        <MobileAppHeader />
      </div>

      <main className="bg-[var(--mc-bg-main)] pb-24 text-[var(--mc-text-main)] md:bg-white md:pb-0 md:text-[#07111a]">
        {/* HERO */}
        <section className="relative overflow-hidden bg-[#07111a]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(52,211,153,0.18),transparent_28%),radial-gradient(circle_at_left,rgba(59,130,246,0.16),transparent_24%)]" />
          <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] [background-size:44px_44px]" />

          <div className="relative mx-auto max-w-[1380px] px-4 py-10 sm:px-6 md:py-20 lg:px-10 lg:py-24">
            <div className="grid items-center gap-7 lg:grid-cols-[1.1fr_0.9fr] md:gap-10">
              <div className="max-w-3xl">
                <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-[#7bc0b0] backdrop-blur-sm md:text-sm">
                  About Multiclout
                </div>

                <h1 className="mt-5 text-[30px] font-bold leading-[1.1] text-white sm:text-[46px] md:text-[58px] xl:text-[72px]">
                  A modern platform built for learners who want more than just content
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-[17px] md:mt-5 md:text-[19px]">
                  Multiclout combines practical learning, expert mentorship, curated
                  videos, and growth-focused systems into one clean ecosystem designed
                  for real progress.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row md:mt-8">
                  <Link
                    to="/watch-videos"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#0b5c8e] to-[#4d9a97] px-6 py-3.5 text-sm font-semibold !text-white hover:opacity-90"
                  >
                    Explore Platform →
                  </Link>

                  <Link
                    to="/franchise"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold !text-white hover:bg-white/20"
                  >
                    Grow With Multiclout
                  </Link>
                </div>
              </div>

              <div className="relative">
                <div className="rounded-[24px] border border-white/10 bg-white/5 p-3 shadow-[0_25px_90px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-5 md:rounded-[28px]">
                  <div className="rounded-[22px] bg-gradient-to-br from-[#0d1b2b] via-[#0b2238] to-[#07111a] p-4 sm:p-6 md:rounded-[24px]">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-[18px] border border-white/10 bg-white/5 p-4 md:rounded-[20px] md:p-5">
                        <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2d7084] to-[#4d9a97] text-white md:h-12 md:w-12">
                          <FiPlayCircle size={22} />
                        </div>
                        <h3 className="text-base font-bold text-white md:text-lg">
                          Curated Learning
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-white/70">
                          Short, structured, practical content built for modern learners.
                        </p>
                      </div>

                      <div className="rounded-[18px] border border-white/10 bg-white/5 p-4 md:rounded-[20px] md:p-5">
                        <div className="text-3xl font-bold text-white">1M+</div>
                        <p className="mt-2 text-sm leading-6 text-white/70">
                          Reach, trust, and growing learner engagement across our content ecosystem.
                        </p>
                      </div>

                      <div className="rounded-[18px] border border-white/10 bg-white/5 p-4 sm:col-span-2 md:rounded-[20px] md:p-5">
                        <div className="flex items-start gap-4">
                          <div className="h-12 w-12 shrink-0 rounded-2xl bg-gradient-to-br from-[#0b5c8e] to-[#4d9a97] md:h-14 md:w-14" />
                          <div>
                            <h3 className="text-base font-bold text-white md:text-lg">
                              Built for learning, growth, and practical progress
                            </h3>
                            <p className="mt-2 text-sm leading-6 text-white/70">
                              We focus on making education feel relevant, modern, and useful in real life.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-5 -left-5 hidden h-24 w-24 rounded-full bg-[#2d7084]/20 blur-2xl md:block" />
                <div className="absolute -right-4 -top-4 hidden h-28 w-28 rounded-full bg-[#4d9a97]/20 blur-2xl md:block" />
              </div>
            </div>
          </div>
        </section>

        {/* INTRO */}
        <section className="relative bg-[var(--mc-bg-main)] py-10 sm:py-16 md:bg-white md:py-20">
          <div className="mx-auto grid max-w-[1380px] items-center gap-7 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-10 md:gap-10">
            <div className="relative">
              <div className="rounded-[24px] border border-[var(--mc-border)] bg-[var(--mc-bg-card)] p-4 shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:p-7 md:rounded-[30px] md:border-0 md:bg-gradient-to-br md:from-[#eef5fb] md:to-[#f7fbfd]">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className={`rounded-[20px] p-5 shadow-sm md:rounded-[22px] ${cardBg}`}>
                    <div className="text-3xl">🎯</div>
                    <h3 className={`mt-3 text-lg font-bold ${headingText}`}>
                      Focused Mission
                    </h3>
                    <p className={`mt-2 text-sm leading-6 ${mutedText}`}>
                      Making learning practical, relevant, and growth-oriented.
                    </p>
                  </div>

                  <div className="rounded-[20px] bg-[#072b57] p-5 text-white shadow-sm md:rounded-[22px]">
                    <div className="text-3xl">⚡</div>
                    <h3 className="mt-3 text-lg font-bold text-white">
                      Modern Approach
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-white/80">
                      Clean content flow, better accessibility, stronger learner engagement.
                    </p>
                  </div>

                  <div className={`rounded-[20px] p-5 shadow-sm sm:col-span-2 md:rounded-[22px] ${cardBg}`}>
                    <div className="text-3xl">🚀</div>
                    <h3 className={`mt-3 text-lg font-bold ${headingText}`}>
                      Built to scale trust and outcomes
                    </h3>
                    <p className={`mt-2 text-sm leading-6 ${mutedText}`}>
                      Multiclout brings together education, execution, and growth in one strong brand experience.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className={`rounded-[24px] p-5 md:rounded-none md:border-0 md:bg-transparent md:p-0 ${cardBg}`}>
              <div className="inline-flex rounded-full border border-[var(--mc-border)] bg-[var(--mc-chip-bg)] px-4 py-2 text-sm font-semibold text-[#0b5c8e] md:border-[#d9e8ef] md:bg-[#f7fbfd]">
                Who We Are
              </div>

              <h2 className={`mt-5 text-[28px] font-bold leading-[1.14] sm:text-[38px] md:text-[48px] ${headingText}`}>
                We are building a cleaner, smarter, and more practical learning experience
              </h2>

              <p className={`mt-4 text-sm leading-7 sm:text-[16px] md:mt-5 md:text-[17px] md:leading-8 ${bodyText}`}>
                Multiclout is designed for the new generation of learners who want
                better clarity, modern content formats, trusted mentors, and
                practical direction. We believe learning should not feel confusing,
                outdated, or disconnected from real growth.
              </p>

              <p className={`mt-4 text-sm leading-7 sm:text-[16px] md:text-[17px] md:leading-8 ${bodyText}`}>
                That is why we focus on structured video learning, better guidance,
                cleaner delivery, and an ecosystem that supports both confidence
                and consistency. Our aim is simple — help learners move forward
                with more direction and better outcomes.
              </p>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="bg-[var(--mc-surface-gradient)] py-10 sm:py-16 md:bg-[#f3f7fa]">
          <div className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-10">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {stats.map((item, index) => (
                <div
                  key={index}
                  className={`rounded-[22px] px-4 py-6 text-center shadow-[0_10px_30px_rgba(15,23,42,0.05)] md:rounded-[24px] md:px-5 md:py-7 ${cardBg}`}
                >
                  <div className="text-[28px] font-bold text-[#13b7dc] sm:text-[34px] md:text-[#072b57]">
                    {item.value}
                  </div>
                  <div className={`mt-2 text-sm sm:text-base ${mutedText}`}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHY MULTICLOUT */}
        <section className="bg-[var(--mc-bg-main)] py-10 sm:py-16 md:bg-white md:py-20">
          <div className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-10">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex rounded-full border border-[var(--mc-border)] bg-[var(--mc-chip-bg)] px-4 py-2 text-sm font-semibold text-[#0b5c8e] md:border-[#d9e8ef] md:bg-[#f7fbfd]">
                Why Multiclout
              </div>

              <h2 className={`mt-5 text-[28px] font-bold leading-[1.14] sm:text-[38px] md:text-[48px] ${headingText}`}>
                More than just content. A stronger learning ecosystem.
              </h2>
            </div>

            <div className="mt-8 grid gap-4 md:mt-10 md:grid-cols-3 md:gap-6">
              {highlights.map((item, index) => (
                <div
                  key={index}
                  className="rounded-[24px] border border-[var(--mc-border)] bg-[var(--mc-bg-card)] p-5 shadow-[0_15px_40px_rgba(15,23,42,0.05)] md:rounded-[28px] md:border-slate-200 md:bg-gradient-to-br md:from-[#f8fbfc] md:to-[#eef5fb] md:p-6"
                >
                  <div className="inline-flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2d7084] to-[#4d9a97] text-white shadow-[0_10px_20px_rgba(45,112,132,0.22)] md:h-14 md:w-14">
                    {item.icon}
                  </div>

                  <h3 className={`mt-5 text-[21px] font-bold md:text-[22px] ${headingText}`}>
                    {item.title}
                  </h3>

                  <p className={`mt-3 text-sm leading-7 md:text-[15px] ${mutedText}`}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STORY / PILLARS */}
        <section className="bg-[#07111a] py-10 sm:py-16 md:py-20">
          <div className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-10">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-[#7bc0b0]">
                Our Foundation
              </div>

              <h2 className="mt-5 text-[28px] font-bold leading-[1.14] text-white sm:text-[38px] md:text-[48px]">
                What defines the Multiclout approach
              </h2>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-3 md:mt-10">
              {pillars.map((item, index) => (
                <div
                  key={index}
                  className="rounded-[24px] border border-white/10 bg-white/5 p-5 text-white backdrop-blur-sm md:rounded-[28px] md:p-6"
                >
                  <div className="text-[36px] font-bold leading-none text-[#7bc0b0]/90 md:text-[40px]">
                    {item.number}
                  </div>
                  <div className="mt-4 h-[3px] w-16 bg-gradient-to-r from-[#2d7084] to-[#4d9a97]" />
                  <h3 className="mt-5 text-[21px] font-bold text-white md:mt-6 md:text-[22px]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-white/75 md:text-[15px]">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden bg-[var(--mc-bg-main)] py-10 sm:py-20 md:bg-white">
          <div className="mx-auto max-w-[1100px] px-4 text-center sm:px-6">
            <div className="rounded-[26px] bg-gradient-to-r from-[#072b57] via-[#0b5c8e] to-[#2d7084] px-5 py-10 text-white shadow-[0_30px_80px_rgba(11,92,142,0.22)] sm:px-10 sm:py-14 md:rounded-[32px]">
              <div className="mx-auto max-w-3xl">
                <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white/90">
                  Grow with Multiclout
                </div>

                <h2 className="mt-5 text-[28px] font-bold leading-[1.12] text-white sm:text-[40px] md:text-[52px]">
                  Start your journey with a platform built for modern learning
                </h2>

                <p className="mt-4 text-sm leading-7 text-white/85 sm:text-[17px]">
                  Explore videos, tutorials, growth-focused content, and practical learning experiences designed to move you forward.
                </p>

                <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row md:mt-8">
                  <Link
                    to="/watch-videos"
                    className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 text-sm font-semibold !text-[#072b57] hover:bg-gray-100"
                  >
                    Explore Videos
                  </Link>

                  <Link
                    to="/franchise"
                    className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold !text-white hover:bg-white/20"
                  >
                    Explore Franchise
                  </Link>
                </div>
              </div>
            </div>
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

export default AboutUs;