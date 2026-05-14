import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiCheck,
  FiChevronDown,
  FiClock,
  FiDownload,
  FiFileText,
  FiGlobe,
  FiPlayCircle,
  FiShoppingCart,
  FiStar,
  FiTv,
  FiAward,
  FiAlertCircle,
} from "react-icons/fi";
import { LuInfinity } from "react-icons/lu";
import { IoPeopleOutline } from "react-icons/io5";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { API, API_HOST } from "../utils/api";
import { useCart } from "../context/CartContext";
import MobileBottomNav from "../components/videos/MobileBottomNav";
import MobileAppHeader from "../components/videos/MobileAppHeader";
import SEO from "../components/SEO";

function CourseDetail() {
  const { slug, id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSections, setOpenSections] = useState({ 0: true });

  const mobilePageBg = "bg-[var(--mc-bg-main)] text-[var(--mc-text-main)] md:bg-white md:text-slate-900";
const mobileCardBg = "bg-[var(--mc-bg-card)] text-[var(--mc-text-main)] border-[var(--mc-border)] md:bg-white md:text-slate-900 md:border-slate-200";
const mobileSoftText = "text-[var(--mc-text-soft)] md:text-slate-700";
const mobileHeading = "text-[var(--mc-text-main)] md:text-[#18345d]";

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);

        const url = slug
          ? `${API}/courses/slug/${slug}`
          : `${API}/courses/${id}`;

        const res = await fetch(url);
        const data = await res.json();

        if (data.success) {
          setCourse(data.course || null);
        } else {
          setCourse(null);
        }
      } catch (error) {
        console.error("Course detail fetch error:", error);
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug, id]);

  const imageUrl = useMemo(() => {
  if (!course?.image) return "";

  const image = String(course.image).trim();

  if (/^https?:\/\//i.test(image)) {
    return image;
  }

  const cleanPath = image
    .replace(/\\/g, "/")
    .replace(/^\/+/, "");

  return `${API_HOST}/${cleanPath}`;
}, [course]);

  const totalLectures = useMemo(() => {
    if (!course?.sections?.length) return 0;

    return course.sections.reduce((acc, section) => {
      const metaCount = parseInt(
        String(section.lecturesCount || "").replace(/\D/g, ""),
        10
      );

      if (!Number.isNaN(metaCount) && metaCount > 0) return acc + metaCount;

      return acc + (section.lessons?.length || 0);
    }, 0);
  }, [course]);

  const totalLength = useMemo(() => {
    if (course?.duration) return course.duration;
    if (!course?.sections?.length) return "";

    return course.sections
      .map((section) => section.duration)
      .filter(Boolean)
      .join(" • ");
  }, [course]);

  const includes = useMemo(() => {
    if (Array.isArray(course?.includes) && course.includes.length > 0) {
      return course.includes;
    }

    return [];
  }, [course]);

  const getIncludeIcon = (item) => {
    const text = String(item || "").toLowerCase();

    if (text.includes("video")) return <FiTv />;
    if (text.includes("article")) return <FiFileText />;
    if (text.includes("download")) return <FiDownload />;
    if (text.includes("mobile") || text.includes("tv")) return <FiTv />;
    if (text.includes("lifetime")) return <LuInfinity />;
    if (text.includes("certificate")) return <FiAward />;

    return <FiCheck />;
  };

  const toggleSection = (idx) => {
    setOpenSections((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const expandAllSections = () => {
    const nextState = {};

    (course?.sections || []).forEach((_, idx) => {
      nextState[idx] = true;
    });

    setOpenSections(nextState);
  };

  const openPreview = () => {
    if (course?.previewVideo) {
      window.open(course.previewVideo, "_blank", "noopener,noreferrer");
    }
  };

  const openLessonVideo = (lesson) => {
    if (lesson?.type === "video" && lesson?.videoUrl) {
      window.open(lesson.videoUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleAddToCart = () => {
    addToCart(course);
    navigate("/cart");
  };

  const handleBuyNow = () => {
    addToCart(course);
    navigate("/cart");
  };

  if (loading) {
    return (
      <>
        <div className="hidden md:block">
          <Navbar />
        </div>

        <div className="md:hidden">
          <MobileAppHeader />
        </div>

        <div className="min-h-[70vh] px-4 py-16 text-center text-sm md:bg-white md:text-base md:text-slate-600">
          <span className="text-[var(--mc-text-soft)] md:text-slate-600">
            Loading course...
          </span>
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

  if (!course) {
    return (
      <>
        <div className="hidden md:block">
          <Navbar />
        </div>

        <div className="md:hidden">
          <MobileAppHeader />
        </div>

        <div className="min-h-[70vh] px-4 py-16 md:bg-white">
          <div className="mx-auto max-w-3xl rounded-[22px] border p-6 text-center shadow-sm md:rounded-[28px] md:border-slate-200 md:bg-white md:p-8">
            <div
              className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full text-red-500 md:h-14 md:w-14 md:bg-red-50"
              style={{
                background: "rgba(239,68,68,0.10)",
              }}
            >
              <FiAlertCircle className="text-2xl" />
            </div>

            <h1 className="text-xl font-bold text-[var(--mc-text-main)] md:text-2xl md:text-slate-900">
              Course not found
            </h1>

            <p className="mt-2 text-sm text-[var(--mc-text-soft)] md:text-base md:text-slate-600">
              Is course ka data nahi mila ya shayad inactive hai.
            </p>
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

  return (
    <>
    <SEO
  title={course?.seoTitle || course?.title || "Course"}
  description={
    course?.seoDescription ||
    course?.subtitle ||
    course?.description ||
    "Explore this course on Multiclout"
  }
  keywords={
    course?.seoKeywords ||
    `${course?.title || ""}, ${course?.category || ""}, Multiclout course`
  }
/>
      <div className="hidden md:block">
        <Navbar />
      </div>

      <div className="md:hidden">
        <MobileAppHeader />
      </div>

      {/* HERO */}
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#04121f_0%,#071a2b_48%,#08283a_100%)] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(45,112,132,0.16),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(77,154,151,0.10),transparent_22%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02),rgba(255,255,255,0))]" />

        <div className="relative mx-auto max-w-[1380px] px-4 pb-7 pt-5 md:px-6 md:pb-10 md:pt-8 lg:px-8 lg:pb-12 lg:pt-10">
          <div className="max-w-4xl py-3 md:py-8 lg:py-10">
            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-medium text-[#48d7ee] md:mb-4 md:gap-3 md:text-sm">
              <span>{course.category}</span>
              {course.subcategory ? <span>›</span> : null}
              {course.subcategory ? <span>{course.subcategory}</span> : null}
            </div>

            <h1 className="max-w-4xl text-[28px] font-bold leading-[1.12] text-white sm:text-4xl md:text-5xl lg:text-[72px]">
              {course.title}
            </h1>

            {course.subtitle || course.description ? (
              <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-200 md:mt-6 md:text-lg md:leading-8 sm:md:text-[20px]">
                {course.subtitle || course.description}
              </p>
            ) : null}

            <div className="mt-5 flex flex-wrap items-center gap-3 text-xs md:mt-6 md:gap-4 md:text-sm sm:md:text-base">
              {course.bestseller || course.tag ? (
                <span className="rounded-md bg-[#18cde7] px-2.5 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-[#07111a] md:px-3 md:text-xs">
                  {course.tag || "Bestseller"}
                </span>
              ) : null}

              <div className="flex items-center gap-2 text-[#37d7ef]">
                <span className="font-bold text-white">
                  {Number(course.rating || 0).toFixed(1)}
                </span>

                <div className="flex text-xs md:text-sm">
                  <FiStar className="fill-current" />
                  <FiStar className="fill-current" />
                  <FiStar className="fill-current" />
                  <FiStar className="fill-current" />
                  <FiStar className="fill-current opacity-50" />
                </div>

                <span className="text-slate-300">
                  ({Number(course.totalRatings || 0).toLocaleString()} ratings)
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <IoPeopleOutline className="text-base md:text-lg" />
                <span>
                  {Number(course.learners || 0).toLocaleString()} students
                </span>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-300 md:mt-5 md:text-base">
              Created by{" "}
              <span className="font-semibold text-[#48d7ee]">
                {course.instructor}
              </span>
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-300 md:gap-x-6 md:gap-y-3 md:text-sm sm:md:text-base">
              {course.lastUpdatedText ? (
                <div className="flex items-center gap-2">
                  <FiClock />
                  <span>Last updated {course.lastUpdatedText}</span>
                </div>
              ) : null}

              <div className="flex items-center gap-2">
                <FiGlobe />
                <span>{course.language || "English"}</span>
              </div>

              <div className="flex items-center gap-2">
                <FiCheck />
                <span>{course.level || "All Levels"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className={`pb-24 md:pb-0 ${mobilePageBg}`}>
        <div className="mx-auto max-w-[1380px] px-4 py-5 md:px-6 md:py-10 lg:px-8">
          <div className="grid gap-7 md:gap-10 lg:grid-cols-[minmax(0,1fr)_390px]">
            {/* LEFT CONTENT */}
            <div className="space-y-7 md:space-y-10">
              {/* MOBILE CARD */}
              <div className="lg:hidden">
                <div className={`overflow-hidden rounded-[22px] border shadow-[0_12px_30px_rgba(2,12,27,0.10)] md:rounded-[26px] md:shadow-[0_18px_40px_rgba(2,12,27,0.10)] ${mobileCardBg}`}>
                  <div
                    className="relative h-[200px] overflow-hidden sm:h-[260px] md:h-[220px] md:sm:h-[280px]"
                  >
                    <img
                      src={imageUrl}
                      alt={course.title}
                      className="h-full w-full object-cover"
                    />

                    {course.previewVideo ? (
                      <>
                        <div className="absolute right-3 top-3 rounded-md bg-[#18cde7] px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#07111a] md:right-4 md:top-4 md:px-3 md:py-2 md:text-xs">
                          Preview Video
                        </div>

                        <button
                          type="button"
                          onClick={openPreview}
                          className="absolute inset-0 flex items-center justify-center bg-black/10 transition hover:bg-black/20"
                        >
                          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/40 bg-white/25 text-white backdrop-blur md:h-20 md:w-20">
                            <FiPlayCircle className="text-3xl md:text-4xl" />
                          </span>
                        </button>
                      </>
                    ) : null}
                  </div>

                  <div
                    className="p-5 md:p-6"
                    style={{
                      background: "var(--mc-bg-card)",
                      color: "var(--mc-text-main)",
                    }}
                  >
                    <div className="flex items-end gap-3">
                      <span className="text-3xl font-extrabold text-[#163462] md:text-4xl">
                        ₹{Number(course.price || 0).toLocaleString()}
                      </span>

                      {Number(course.oldPrice) > 0 ? (
                        <span className="pb-1 text-xl text-[var(--mc-text-soft)] line-through md:text-2xl md:text-slate-400">
                          ₹{Number(course.oldPrice).toLocaleString()}
                        </span>
                      ) : null}
                    </div>

                    {course.offerText ? (
                      <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-[#13b7dc] md:text-base">
                        <FiClock />
                        <span>{course.offerText}</span>
                      </p>
                    ) : null}

                    <div className="mt-5 space-y-3 md:mt-6 md:space-y-4">
                      <button
                        onClick={handleAddToCart}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#163462] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#102a52] md:py-4 md:text-lg"
                      >
                        <FiShoppingCart />
                        Add to cart
                      </button>

                      <button
                        onClick={handleBuyNow}
                        className="w-full rounded-2xl border px-5 py-3.5 text-sm font-semibold transition md:border-slate-300 md:bg-white md:py-4 md:text-lg md:text-[#163462] md:hover:border-slate-400 md:hover:bg-slate-50"
                        style={{
                          borderColor: "var(--mc-border)",
                          background: "var(--mc-bg-card)",
                          color: "var(--mc-text-main)",
                        }}
                      >
                        Buy now
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {course.whatYouWillLearn?.length ? (
              <section className={`rounded-[22px] border p-5 md:rounded-[28px] md:bg-[#f8fbfc] md:p-8 ${mobileCardBg}`}>
  <h2 className={`text-[24px] font-bold leading-tight md:text-3xl ${mobileHeading}`}>
                    What you'll learn
                  </h2>

                  <div className="mt-5 grid gap-4 md:mt-6 md:grid-cols-2 md:gap-5">
                    {course.whatYouWillLearn.map((item, idx) => (
                      <div
                        key={idx}
                      className={`flex items-start gap-3 text-sm leading-6 md:text-[18px] md:leading-8 ${mobileSoftText}`}
                      >
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#dff7ef] text-[#13b7dc] md:mt-1 md:h-7 md:w-7">
                          <FiCheck />
                        </span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}

              {course.sections?.length ? (
                <section>
                  <div className="mb-4 flex flex-col gap-2 md:mb-5 sm:md:flex-row sm:md:items-center sm:md:justify-between">
                    <div>
                      <h2 className="text-[26px] font-bold leading-tight text-[var(--mc-text-main)] md:text-3xl md:text-[#18345d]">
                        Course content
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-[var(--mc-text-soft)] md:text-lg md:text-slate-500">
                        {course.sections.length} sections • {totalLectures} lectures
                        {totalLength ? ` • ${totalLength} total length` : ""}
                      </p>
                    </div>

                    <button
                      onClick={expandAllSections}
                      className="w-fit text-sm font-semibold text-[#10b8db] transition hover:text-[#0e9fbd] md:text-lg"
                    >
                      Expand all sections
                    </button>
                  </div>

                 <div className={`overflow-hidden rounded-[22px] border md:rounded-[24px] ${mobileCardBg}`}>
                    {course.sections.map((section, idx) => {
                      const isOpen = !!openSections[idx];

                      return (
                        <div
                          key={idx}
                          className={`${
                            idx !== course.sections.length - 1
                              ? "border-b"
                              : ""
                          } md:border-slate-200`}
                          style={{
                            borderColor: "var(--mc-border)",
                          }}
                        >
                          <button
                            onClick={() => toggleSection(idx)}
                           className="flex w-full items-center justify-between gap-3 bg-[var(--mc-bg-card)] px-4 py-4 text-left transition md:bg-slate-50 md:px-5 md:py-5 md:hover:bg-slate-100"
                            style={{
                              background: "var(--mc-bg-card)",
                            }}
                          >
                            <div className="flex-1">
                              <h3 className="text-[21px] font-bold leading-snug text-[var(--mc-text-main)] md:text-2xl md:text-[#18345d]">
                                {section.title}
                              </h3>
                            </div>

                            <div className="flex shrink-0 items-center gap-2 md:gap-4">
                              <span className="max-w-[95px] text-right text-xs leading-5 text-[var(--mc-text-soft)] md:max-w-none md:text-base md:text-slate-500">
                                {section.lecturesCount ||
                                  `${section.lessons?.length || 0} lectures`}
                                {section.duration ? ` • ${section.duration}` : ""}
                              </span>

                              <FiChevronDown
                                className={`text-base text-[var(--mc-text-soft)] transition-transform md:text-xl md:text-slate-500 ${
                                  isOpen ? "rotate-180" : ""
                                }`}
                              />
                            </div>
                          </button>

                          {isOpen ? (
                            <div className="bg-[var(--mc-bg-card)] px-4 py-1 md:bg-white md:px-5 md:py-2">
                              {(section.lessons || []).map((lesson, lessonIdx) => (
                                <div
                                  key={lessonIdx}
                                  onClick={() => openLessonVideo(lesson)}
                                  className={`flex items-center justify-between gap-3 border-b py-3.5 last:border-b-0 md:gap-4 md:border-slate-100 md:py-4 ${
                                    lesson.type === "video" && lesson.videoUrl
                                      ? "cursor-pointer md:hover:bg-slate-50"
                                      : ""
                                  }`}
                                  style={{
                                    borderColor: "var(--mc-border)",
                                  }}
                                >
                                  <div className="flex items-center gap-3 text-sm leading-6 text-[var(--mc-text-main)] md:text-lg md:text-slate-700">
                                    <span className="shrink-0 text-[#10b8db]">
                                      {lesson.type === "resource" ||
                                      lesson.type === "article" ? (
                                        <FiFileText />
                                      ) : (
                                        <FiPlayCircle />
                                      )}
                                    </span>

                                    <span>{lesson.title}</span>
                                  </div>

                                  <span className="shrink-0 text-xs text-[var(--mc-text-soft)] md:text-base md:text-slate-500">
                                    {lesson.duration || ""}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </section>
              ) : null}

              {course.requirements?.length ? (
                <section>
                 <h2 className={`text-[26px] font-bold leading-tight md:text-3xl ${mobileHeading}`}>
                    Requirements
                  </h2>

                  <ul className="mt-4 space-y-3 md:mt-5 md:space-y-4">
                    {course.requirements.map((item, idx) => (
                      <li
                        key={idx}
                       className={`flex items-start gap-3 text-sm leading-7 md:text-[18px] md:leading-8 ${mobileSoftText}`}
                      >
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#10b8db] md:h-2.5 md:w-2.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {course.fullDescription ||
              course.description ||
              course.outcomes?.length ? (
                <section>
                  <h2 className="text-[26px] font-bold leading-tight text-[var(--mc-text-main)] md:text-3xl md:text-[#18345d]">
                    Description
                  </h2>

                  {course.fullDescription ? (
                    <div className="mt-4 whitespace-pre-line text-sm leading-7 text-[var(--mc-text-soft)] md:mt-5 md:text-[18px] md:leading-9 md:text-slate-700">
                      {course.fullDescription}
                    </div>
                  ) : course.description ? (
                    <p className="mt-4 text-sm leading-7 text-[var(--mc-text-soft)] md:mt-5 md:text-[18px] md:leading-9 md:text-slate-700">
                      {course.description}
                    </p>
                  ) : null}

                  {course.outcomes?.length ? (
                    <div className="mt-7 md:mt-8">
                      <h3 className="text-xl font-bold text-[var(--mc-text-main)] md:text-2xl md:text-[#18345d]">
                        By the end of this course, you will be able to:
                      </h3>

                      <div className="mt-4 space-y-3 md:mt-5 md:space-y-4">
                        {course.outcomes.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-3 text-sm leading-7 text-[var(--mc-text-soft)] md:text-[18px] md:leading-8 md:text-slate-700"
                          >
                            <span className="mt-1 text-[#10b8db]">
                              <FiCheck />
                            </span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </section>
              ) : null}
            </div>

            {/* RIGHT STICKY CARD */}
            <aside className="hidden lg:block">
              <div className="sticky top-[96px] -mt-[350px]">
                <div className="overflow-hidden rounded-[26px] border border-slate-200 bg-white text-slate-900 shadow-[0_20px_50px_rgba(2,12,27,0.10)]">
                  <div className="relative h-[240px] overflow-hidden sm:h-[280px]">
                    <img
                      src={imageUrl}
                      alt={course.title}
                      className="h-full w-full object-cover"
                    />

                    {course.previewVideo ? (
                      <>
                        <div className="absolute right-4 top-4 rounded-md bg-[#18cde7] px-3 py-2 text-xs font-bold uppercase tracking-wide text-[#07111a]">
                          Preview Video
                        </div>

                        <button
                          type="button"
                          onClick={openPreview}
                          className="absolute inset-0 flex items-center justify-center bg-black/10 transition hover:bg-black/20"
                        >
                          <span className="flex h-24 w-24 items-center justify-center rounded-full border border-white/40 bg-white/25 text-white backdrop-blur">
                            <FiPlayCircle className="text-5xl" />
                          </span>
                        </button>
                      </>
                    ) : null}
                  </div>

                  <div className="p-6">
                    <div className="flex items-end gap-3">
                      <span className="text-4xl font-extrabold text-[#163462]">
                        ₹{Number(course.price || 0).toLocaleString()}
                      </span>

                      {Number(course.oldPrice) > 0 ? (
                        <span className="pb-1 text-2xl text-slate-400 line-through">
                          ₹{Number(course.oldPrice).toLocaleString()}
                        </span>
                      ) : null}
                    </div>

                    {course.offerText ? (
                      <p className="mt-3 flex items-center gap-2 text-base font-semibold text-[#13b7dc]">
                        <FiClock />
                        <span>{course.offerText}</span>
                      </p>
                    ) : null}

                    <div className="mt-6 space-y-4">
                      <button
                        onClick={handleAddToCart}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#163462] px-5 py-4 text-lg font-semibold text-white transition hover:bg-[#102a52]"
                      >
                        <FiShoppingCart />
                        Add to cart
                      </button>

                      <button
                        onClick={handleBuyNow}
                        className="w-full rounded-2xl border border-slate-300 bg-white px-5 py-4 text-lg font-semibold text-[#163462] transition hover:border-slate-400 hover:bg-slate-50"
                      >
                        Buy now
                      </button>
                    </div>

                    <p className="mt-5 text-center text-sm font-medium text-slate-400">
                      {course.moneyBackDays || 30}-Day Money-Back Guarantee
                    </p>

                    {includes.length > 0 ? (
                      <div className="mt-8 border-t border-slate-200 pt-6">
                        <h3 className="text-[15px] font-extrabold uppercase tracking-wide text-[#18345d]">
                          This course includes:
                        </h3>

                        <div className="mt-5 space-y-4">
                          {includes.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-3 text-[17px] text-slate-600"
                            >
                              <span className="text-[#13b7dc]">
                                {getIncludeIcon(item)}
                              </span>
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-5 text-sm font-semibold text-slate-500">
                      <button className="transition hover:text-slate-900">
                        Share
                      </button>
                      <button className="transition hover:text-slate-900">
                        Gift course
                      </button>
                      <button className="transition hover:text-slate-900">
                        Apply Coupon
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
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

export default CourseDetail;