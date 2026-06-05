import { useState, useEffect, useMemo, useRef } from "react";
import {
  FiStar,
  FiChevronRight,
  FiChevronLeft,
  FiClock,
  FiCheck,
  FiShoppingCart,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../utils/api";
import { getImageUrl } from "../utils/videoHelpers";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";

function CoursesSection() {
  const sliderRef = useRef(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [hoveredCourseId, setHoveredCourseId] = useState(null);

  const { addToCart } = useCart();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API}/courses`);
        setCourses(res.data.courses || []);
      } catch (error) {
        console.error("Error fetching courses", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const dynamicCategories = useMemo(() => {
    const clean = courses.map((c) => c.category?.trim()).filter(Boolean);
    return ["All Categories", ...new Set(clean)];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    if (activeCategory === "All Categories") return courses;

    return courses.filter(
      (c) =>
        c.category?.trim()?.toLowerCase() ===
        activeCategory.trim().toLowerCase(),
    );
  }, [courses, activeCategory]);

  const resolveImage = (course) => {
    return getImageUrl(
      course?.image,
      "https://via.placeholder.com/600x400?text=Course",
    );
  };

  const getHighlights = (course) => {
    if (
      Array.isArray(course.whatYouWillLearn) &&
      course.whatYouWillLearn.length > 0
    ) {
      return course.whatYouWillLearn.slice(0, 3);
    }

    return [
      `Build practical skills in ${course.category || "high-demand topics"}`,
      "Learn through structured lessons and real examples",
      "Get guided learning for growth and better outcomes",
    ];
  };

  const handleAddToCart = (e, course) => {
    e.stopPropagation();
    addToCart(course);
    navigate("/cart");
  };

  const handleBuyNow = (e, course) => {
    e.stopPropagation();
    addToCart(course);
    navigate("/cart");
  };

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat);
    setShowAllCourses(false);
    setHoveredCourseId(null);
  };

  const openCourse = (course) => {
    if (course?.slug) {
      navigate(`/courses/${course.slug}`);
      return;
    }

    if (course?._id) {
      navigate(`/courses/id/${course._id}`);
    }
  };

  const scrollCourses = (direction) => {
    if (!sliderRef.current) return;

    const scrollAmount = 340;

    sliderRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const renderCourseCard = (course, idx, isSlider = false) => {
    const image = resolveImage(course);
    const rating =
      typeof course.rating === "number" ? course.rating.toFixed(1) : "4.5";
    const learners = Number(course.learners || 0).toLocaleString();
    const highlights = getHighlights(course);
    const courseId = course._id || idx;
    const isHovered = hoveredCourseId === courseId;

    return (
      <div
        key={courseId}
        className={`group relative cursor-pointer ${
          isSlider
            ? "snap-center min-w-[260px] max-w-[260px] flex-shrink-0 sm:min-w-[290px] sm:max-w-[290px] lg:min-w-[310px] lg:max-w-[320px]"
            : "w-full"
        }`}
        onClick={() => openCourse(course)}
        onMouseEnter={() => {
          if (window.innerWidth >= 1280) {
            setHoveredCourseId(courseId);
          }
        }}
        onMouseLeave={() => {
          setHoveredCourseId(null);
        }}
      >
        <div
          className="relative overflow-hidden rounded-[22px] border shadow-[0_14px_30px_rgba(15,23,42,0.05)] transition-shadow duration-300 xl:border-slate-200 xl:bg-white xl:hover:shadow-[0_22px_50px_rgba(15,23,42,0.10)]"
          style={{
            background: "var(--mc-bg-card-strong)",
            borderColor: "var(--mc-border)",
          }}
        >
          <div className="relative h-36 overflow-hidden sm:h-40 lg:h-44">
            <img
              src={image}
              alt={course.title}
              loading="lazy"
              draggable="false"
              className="h-full w-full object-cover"
            />
            {course.tag && (
              <span className="absolute left-3 top-3 rounded-full bg-[#dff7ef] px-2.5 py-1 text-[10px] font-bold text-[#116149] shadow-sm sm:px-3 sm:text-[11px]">
                {course.tag}
              </span>
            )}
          </div>

          <div className="p-4 pb-4 sm:p-5 sm:pb-4">
            <h3
              className="mb-2 line-clamp-2 text-[15px] font-bold leading-snug sm:text-[17px] xl:text-slate-900"
              style={{ color: "var(--mc-text-main)" }}
            >
              {course.title}
            </h3>

            <p
              className="mb-2 truncate text-[13px] sm:text-sm xl:text-slate-500"
              style={{ color: "var(--mc-text-soft)" }}
            >
              {course.instructor || "Expert Instructor"}
            </p>

            <div className="mb-2.5 flex items-center gap-1.5">
              <span className="text-[13px] font-bold text-[#b4690e] sm:text-sm">
                {rating}
              </span>

              <div className="flex text-[11px] text-[#b4690e] sm:text-xs">
                <FiStar className="fill-current" />
                <FiStar className="fill-current" />
                <FiStar className="fill-current" />
                <FiStar className="fill-current" />
                <FiStar className="fill-current opacity-50" />
              </div>

              <span className="ml-1 text-[11px] text-slate-500 sm:text-xs">
                ({learners})
              </span>
            </div>

            <div className="mb-3 flex items-center gap-2">
              <span
                className="text-[17px] font-bold sm:text-xl xl:text-slate-900"
                style={{ color: "var(--mc-text-main)" }}
              >
                ₹{course.price || 0}
              </span>

              {Number(course.oldPrice) > 0 && (
                <span className="text-[13px] text-slate-400 line-through sm:text-sm">
                  ₹{course.oldPrice}
                </span>
              )}
            </div>

            <div className="mb-0 flex items-center gap-2 text-[11px] text-slate-500 sm:text-xs">
              <FiClock />
              <span>
                {course.duration || "Self-paced"} •{" "}
                {course.level || "All Levels"}
              </span>
            </div>

            <div className="mt-4 flex flex-col gap-2 xl:hidden">
              <button
                onClick={(e) => handleAddToCart(e, course)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:border-[#2d7084] hover:text-[#2d7084]"
              >
                <FiShoppingCart />
                Add to Cart
              </button>

              <button
                onClick={(e) => handleBuyNow(e, course)}
                className="rounded-full bg-gradient-to-r from-[#2d7084] to-[#4d9a97] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-95"
              >
                Buy Now
              </button>
            </div>
          </div>

          {isHovered && (
            <div className="absolute inset-0 z-20 hidden flex-col bg-white p-4 xl:flex">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                {course.tag && (
                  <span className="rounded-full bg-[#dff7ef] px-3 py-1 text-[11px] font-bold text-[#116149]">
                    {course.tag}
                  </span>
                )}
                <span className="text-xs text-slate-500">
                  {course.duration || "20+ total hours"}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-500">
                  {course.level || "All Levels"}
                </span>
              </div>

              <h4 className="text-[16px] font-bold leading-snug text-slate-900">
                {course.title}
              </h4>

              <div className="mt-3 flex-1 overflow-hidden pr-1">
                <p className="text-sm leading-6 text-slate-600">
                  {course.description ||
                    "Complete practical learning with structured lessons, guided explanation, and growth-focused outcomes."}
                </p>

                <div className="mt-3 space-y-2.5">
                  {highlights.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 text-sm leading-6 text-slate-700"
                    >
                      <FiCheck className="mt-1 shrink-0 text-[#2d7084]" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-2.5 pt-3">
                <button
                  onClick={(e) => handleAddToCart(e, course)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:border-[#2d7084] hover:text-[#2d7084]"
                >
                  <FiShoppingCart />
                  Add to Cart
                </button>

                <button
                  onClick={(e) => handleBuyNow(e, course)}
                  className="rounded-full bg-gradient-to-r from-[#2d7084] to-[#4d9a97] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-95"
                >
                  Buy Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <section
      className="relative overflow-visible px-4 pb-14 pt-10 sm:pb-16 sm:pt-12 md:bg-white md:px-8 md:pb-20 md:pt-14"
      style={{
        background: "var(--mc-bg-main)",
        color: "var(--mc-text-main)",
      }}
    >
      <div className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-teal-500/5 blur-[110px]" />
      <div className="pointer-events-none absolute bottom-0 left-[-100px] h-[400px] w-[400px] rounded-full bg-sky-500/5 blur-[100px]" />

      <div className="container-custom relative z-10 max-w-[1450px]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6 text-center sm:mb-8"
        >
          {/* TAG */}
          <span className="inline-flex rounded-full border border-[#d8ece8] bg-[#f4fbf9] px-3 py-1.5 text-[11px] font-semibold tracking-wide text-[#2d7084] sm:text-xs">
            Explore Learning Paths
          </span>

          {/* HEADING */}
          <h2
            className="mt-3 text-[26px] font-bold leading-[1.2] sm:text-[32px] md:text-[40px]"
            style={{ color: "var(--mc-text-main)" }}
          >
            Skills to transform your{" "}
            <span className="bg-gradient-to-r from-[#2d7084] to-[#4d9a97] bg-clip-text text-transparent">
              career and life
            </span>
          </h2>

          {/* SUBTEXT */}
          <p
            className="mx-auto mt-2 max-w-xl text-[14px] leading-6 sm:text-[15px] md:text-[16px]"
            style={{ color: "var(--mc-text-soft)" }}
          >
            Learn practical, job-focused, and growth-driven topics with curated
            premium courses.
          </p>
        </motion.div>

        {/* MOBILE SCROLL (REELS STYLE) */}
        <div className="mb-6 block sm:hidden">
          <div className="flex flex-col gap-3 overflow-x-auto hide-scrollbar">
            {/* Row 1 */}
            <div className="flex gap-2.5 min-w-max">
              {dynamicCategories
                .slice(0, Math.ceil(dynamicCategories.length / 2))
                .map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className={`whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-semibold transition-all ${
                      activeCategory === cat
                        ? "bg-[#0f172a] text-white shadow-md"
                        : "border"
                    }`}
                    style={{
                      background:
                        activeCategory === cat
                          ? "#0f172a"
                          : "var(--mc-bg-card)",
                      color:
                        activeCategory === cat
                          ? "#ffffff"
                          : "var(--mc-text-main)",
                      borderColor:
                        activeCategory === cat ? "#0f172a" : "var(--mc-border)",
                    }}
                  >
                    {cat}
                  </button>
                ))}
            </div>

            {/* Row 2 */}
            <div className="flex gap-2.5 min-w-max">
              {dynamicCategories
                .slice(Math.ceil(dynamicCategories.length / 2))
                .map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className={`whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-semibold transition-all ${
                      activeCategory === cat
                        ? "bg-[#0f172a] text-white shadow-md"
                        : "border"
                    }`}
                    style={{
                      background:
                        activeCategory === cat
                          ? "#0f172a"
                          : "var(--mc-bg-card)",
                      color:
                        activeCategory === cat
                          ? "#ffffff"
                          : "var(--mc-text-main)",
                      borderColor:
                        activeCategory === cat ? "#0f172a" : "var(--mc-border)",
                    }}
                  >
                    {cat}
                  </button>
                ))}
            </div>
          </div>
        </div>

        {/* DESKTOP SAME AS IT IS */}
        <div className="mb-8 hidden flex-wrap justify-center gap-2.5 sm:flex sm:mb-10 sm:gap-3">
          {dynamicCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`rounded-full px-4 py-2 text-[13px] font-semibold transition-all duration-300 sm:px-5 sm:py-2.5 sm:text-sm ${
                activeCategory === cat
                  ? "bg-[#0f172a] text-white shadow-md"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-[#2d7084]/40 hover:text-[#2d7084]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div
          className="rounded-[24px] border p-3 sm:rounded-[28px] sm:p-4 md:rounded-[30px] md:border-slate-200 md:bg-[#f8fbfc] md:p-6"
          style={{
            background: "var(--mc-bg-card)",
            borderColor: "var(--mc-border)",
          }}
        >
          {loading ? (
            <div className="py-12 text-center font-semibold text-slate-500 sm:py-16">
              Loading courses...
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="py-12 text-center font-semibold text-slate-500 sm:py-16">
              No courses available for this category.
            </div>
          ) : showAllCourses ? (
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4 xl:gap-6">
              {filteredCourses.map((course, idx) => (
                <div
                  key={course._id || idx}
                  className="mx-auto w-full max-w-[320px] sm:max-w-none"
                >
                  {renderCourseCard(course, idx, false)}
                </div>
              ))}
            </div>
          ) : (
            <div className="relative">
  {/* LEFT BUTTON */}
  <button
    onClick={() => scrollCourses("left")}
    className="absolute left-[-12px] top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-lg transition hover:border-[#2d7084] hover:text-[#2d7084] lg:flex"
  >
    <FiChevronLeft size={22} />
  </button>

  {/* RIGHT BUTTON */}
  <button
    onClick={() => scrollCourses("right")}
    className="absolute right-[-12px] top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-lg transition hover:border-[#2d7084] hover:text-[#2d7084] lg:flex"
  >
    <FiChevronRight size={22} />
  </button>

  {/* COURSES SLIDER */}
  <div
    ref={sliderRef}
    className="flex gap-4 overflow-x-auto overflow-y-hidden pb-2 hide-scrollbar sm:gap-5 lg:gap-6"
    style={{
      scrollBehavior: "smooth",
      WebkitOverflowScrolling: "touch",
      willChange: "scroll-position",
    }}
    onMouseLeave={() => setHoveredCourseId(null)}
  >
    {filteredCourses.map((course, idx) =>
      renderCourseCard(course, idx, true),
    )}
  </div>
</div>
          )}
        </div>

        {filteredCourses.length > 4 && (
          <div className="mt-7 flex justify-center sm:mt-8">
            <button
              onClick={() => setShowAllCourses((prev) => !prev)}
              className="group flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition hover:border-[#2d7084] hover:text-[#2d7084] sm:px-6 sm:py-3 md:border-slate-300 md:bg-white md:text-slate-900"
              style={{
                background: "var(--mc-bg-card-strong)",
                borderColor: "var(--mc-border)",
                color: "var(--mc-text-main)",
              }}
            >
              <span>{showAllCourses ? "Show Less" : "View All"}</span>
              <FiChevronRight
                className={`transition-transform duration-300 ${
                  showAllCourses ? "rotate-90" : "group-hover:translate-x-1"
                }`}
              />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default CoursesSection;
