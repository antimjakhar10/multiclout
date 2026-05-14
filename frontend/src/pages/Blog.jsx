import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight, CalendarDays, UserRound } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MobileBottomNav from "../components/videos/MobileBottomNav";
import MobileAppHeader from "../components/videos/MobileAppHeader";
import { API } from "../utils/api";

const API_HOST = API.replace(/\/api\/?$/, "");

const getBlogImage = (image) => {
  if (!image) return `${API_HOST}/uploads/no-image.jpg`;

  if (typeof image === "object") {
    image = image.url || image.path || image.filename || image.image || "";
  }

  const clean = String(image).trim().replace(/\\/g, "/").replace(/^\/+/, "");

  if (!clean) return `${API_HOST}/uploads/no-image.jpg`;
  if (/^https?:\/\//i.test(clean)) return clean;
  if (clean.startsWith("uploads/")) return `${API_HOST}/${clean}`;

  return `${API_HOST}/uploads/${clean}`;
};

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const pageBg =
    "bg-[var(--mc-bg-main)] text-[var(--mc-text-main)] md:bg-[#f7f9fc] md:text-[#101828]";
  const cardBg =
    "border border-[var(--mc-border)] bg-[var(--mc-bg-card)] text-[var(--mc-text-main)] md:border-slate-200 md:bg-white md:text-slate-900";
  const headingText = "text-[var(--mc-text-main)] md:text-slate-950";
  const bodyText = "text-[var(--mc-text-soft)] md:text-slate-600";
  const mutedText = "text-[var(--mc-text-soft)] md:text-slate-500";

  useEffect(() => {
    fetchCategories();
    fetchBlogs();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API}/blogs/categories`);
      const data = await res.json();

      if (data.success) {
        setCategories(data.categories?.length ? data.categories : ["All"]);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/blogs`);
      const data = await res.json();

      if (data.success) {
        setBlogs(data.blogs || []);
      }
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const keyword = search.trim().toLowerCase();

      const blogTitle = (blog.title || "").toLowerCase();
      const blogExcerpt = (blog.excerpt || "").toLowerCase();
      const blogCategory = (blog.category || "").toLowerCase();
      const blogAuthor = (blog.author || "").toLowerCase();
      const blogReadTime = (blog.readTime || "").toLowerCase();
      const tagsText = Array.isArray(blog.tags)
        ? blog.tags.join(" ").toLowerCase()
        : "";

      const matchesCategory =
        activeCategory === "All" ||
        blogCategory === activeCategory.toLowerCase();

      const matchesSearch =
        !keyword ||
        blogTitle.includes(keyword) ||
        blogExcerpt.includes(keyword) ||
        blogCategory.includes(keyword) ||
        blogAuthor.includes(keyword) ||
        blogReadTime.includes(keyword) ||
        tagsText.includes(keyword);

      return matchesCategory && matchesSearch;
    });
  }, [blogs, activeCategory, search]);

  const featuredBlog =
    filteredBlogs.find((blog) => blog.featured) || filteredBlogs[0] || null;

  const otherBlogs = filteredBlogs.filter(
    (blog) => blog._id !== featuredBlog?._id
  );

  const recentBlogs = [...filteredBlogs].slice(0, 4);

  return (
    <div className={`min-h-screen pb-24 md:pb-0 ${pageBg}`}>
      <div className="sticky top-0 z-[100] hidden md:block bg-white shadow-sm">
  <Navbar />
</div>

      <div className="md:hidden">
        <MobileAppHeader />
      </div>

      <section className="relative overflow-hidden bg-[#07111a] px-4 pb-9 pt-8 md:px-0 md:pb-20 md:pt-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,122,0,0.18),transparent_34%),radial-gradient(circle_at_top_right,rgba(0,116,217,0.18),transparent_36%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,17,26,0.78),rgba(7,17,26,0.98))]" />

        <div className="relative z-10 mx-auto max-w-7xl sm:px-6 lg:px-10">
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/80 md:text-[11px] md:tracking-[0.26em]">
              Multiclout Blog
            </span>

            <h1 className="mt-5 text-[30px] font-extrabold leading-tight text-white md:mt-6 md:text-5xl lg:text-6xl">
              Ideas, insights and practical guidance for modern growth
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/70 md:mt-5 md:text-base">
              Explore articles on learning, business, strategy and personal
              progress in a clean professional reading experience.
            </p>

            <div className="mx-auto mt-7 max-w-2xl md:mt-8">
              <div className="flex h-12 items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 shadow-2xl shadow-black/20 backdrop-blur-md md:h-14">
                <Search size={18} className="text-white/55" />
                <input
                  type="text"
                  placeholder="Search articles, categories or topics..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-full w-full bg-transparent text-sm text-white placeholder:text-white/45 focus:outline-none md:text-base"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sticky top-0 z-20 border-b border-[var(--mc-border)] bg-[var(--mc-bg-card)]/95 backdrop-blur-xl md:static md:z-auto md:border-slate-200 md:bg-[#f7f9fc] md:backdrop-blur-0">
        <div className="mx-auto max-w-[1500px] px-4 py-3 sm:px-6 lg:px-10">
          <div className="flex items-center gap-3 overflow-x-auto pb-1 md:flex-wrap md:justify-center md:overflow-visible md:pb-0">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  activeCategory === category
                    ? "bg-[#13b7dc] text-[#06101d] shadow-md md:bg-[#07111a] md:text-white"
                    : "bg-[var(--mc-chip-bg)] text-[var(--mc-text-main)] hover:opacity-90 md:bg-[#f1f5f9] md:text-[#334155] md:hover:bg-[#e2e8f0]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-12 pt-5 md:pb-16 md:pt-8">
        <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-10">
          {loading ? (
            <div className={`rounded-[24px] px-6 py-16 text-center shadow-sm md:rounded-[30px] md:px-6 md:py-20 ${cardBg}`}>
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[var(--mc-border)] border-t-[#13b7dc] md:border-slate-200 md:border-t-[#07111a]" />
              <p className={`mt-5 text-base font-semibold ${mutedText}`}>
                Loading articles...
              </p>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="grid items-start gap-6 xl:grid-cols-[1.55fr_0.75fr] md:gap-8">
              <div className={`rounded-[24px] px-5 py-10 shadow-sm md:rounded-[30px] md:px-10 md:py-12 ${cardBg}`}>
                <span className="inline-flex rounded-full bg-orange-50 px-4 py-1 text-xs font-bold uppercase tracking-[0.18em] text-orange-600">
                  No articles yet
                </span>

                <h2 className={`mt-5 text-2xl font-extrabold leading-tight md:text-4xl ${headingText}`}>
                  Your blog space is ready for beautifully written content
                </h2>

                <p className={`mt-4 max-w-2xl text-sm leading-7 md:text-base md:leading-8 ${bodyText}`}>
                  Abhi blog posts available nahi hain. Jaise hi admin se blogs
                  add karoge, yahan featured article, latest posts aur clean
                  magazine-style layout show hoga.
                </p>

                <div className="mt-7 flex flex-wrap gap-3 md:mt-8 md:gap-4">
                  <Link
                    to="/admin/blogs"
                    className="inline-flex items-center gap-2 rounded-full bg-[#07111a] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0b1d2d] md:px-6"
                  >
                    Add Blogs From Admin
                    <ArrowRight size={16} />
                  </Link>

                  <button
                    onClick={() => {
                      setSearch("");
                      setActiveCategory("All");
                    }}
                    className="rounded-full border border-[var(--mc-border)] px-5 py-3 text-sm font-bold text-[var(--mc-text-main)] transition hover:opacity-90 md:border-slate-300 md:px-6 md:text-slate-700 md:hover:bg-slate-50"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>

              <div className={`rounded-[24px] p-5 shadow-sm md:rounded-[30px] md:p-8 ${cardBg}`}>
                <h3 className={`text-xl font-extrabold ${headingText}`}>
                  What will appear here
                </h3>

                <div className="mt-5 space-y-3 md:mt-6 md:space-y-4">
                  {[
                    "Featured article section with large cover image",
                    "Latest blog cards in a premium grid layout",
                    "Category based filtering",
                    "Search by topic, title, tag or author",
                    "Single blog detail page with related posts",
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 rounded-2xl border border-[var(--mc-border)] bg-[var(--mc-chip-bg)] p-4 md:border-slate-100 md:bg-slate-50"
                    >
                      <div className="mt-1.5 h-2.5 w-2.5 rounded-full bg-orange-500" />
                      <p className={`text-sm leading-7 ${bodyText}`}>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {featuredBlog && (
                <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr] md:gap-8">
                  <Link
                    to={`/blog/${featuredBlog.slug}`}
                    className={`group overflow-hidden rounded-[26px] shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl md:rounded-[32px] ${cardBg}`}
                  >
                    <div className="relative h-[240px] overflow-hidden bg-slate-200 md:h-[470px]">
                      <img
                        src={getBlogImage(featuredBlog.image)}
                        alt={featuredBlog.title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                      <div className="absolute left-4 top-4 md:left-6 md:top-6">
                        <span className="rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#07111a] md:px-4 md:text-xs">
                          Featured Story
                        </span>
                      </div>
                    </div>

                    <div className="p-5 md:p-8">
                      <div className={`flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] ${mutedText}`}>
                        <span>{featuredBlog.category}</span>
                        <span>•</span>
                        <span>{featuredBlog.readTime || "5 min read"}</span>
                      </div>

                      <h2 className={`mt-3 text-2xl font-extrabold leading-tight md:mt-4 md:text-3xl xl:text-[42px] xl:leading-[1.16] ${headingText}`}>
                        {featuredBlog.title}
                      </h2>

                      <p className={`mt-3 text-sm leading-7 md:mt-4 md:text-[15px] md:leading-8 ${bodyText}`}>
                        {featuredBlog.excerpt}
                      </p>

                      <div className={`mt-5 flex flex-wrap items-center justify-between gap-3 text-sm md:mt-6 ${mutedText}`}>
                        <span className="inline-flex items-center gap-2">
                          <UserRound size={15} />
                          By {featuredBlog.author || "Admin"}
                        </span>

                        <span className="inline-flex items-center gap-2">
                          <CalendarDays size={15} />
                          {formatDate(
                            featuredBlog.publishedAt || featuredBlog.createdAt
                          )}
                        </span>
                      </div>
                    </div>
                  </Link>

                  <div className={`rounded-[26px] p-5 shadow-sm md:rounded-[32px] md:p-6 ${cardBg}`}>
                    <h3 className={`text-xl font-extrabold ${headingText}`}>
                      Recent Posts
                    </h3>

                    <div className="mt-5 space-y-3 md:mt-6 md:space-y-4">
                      {recentBlogs.map((blog) => (
                        <Link
                          key={blog._id}
                          to={`/blog/${blog.slug}`}
                          className="group flex gap-4 rounded-2xl border border-[var(--mc-border)] p-3 transition hover:opacity-90 md:border-slate-100 md:hover:bg-slate-50"
                        >
                          <img
                            src={getBlogImage(blog.image)}
                            alt={blog.title}
                            className="h-20 w-24 shrink-0 rounded-xl object-cover"
                          />

                          <div className="min-w-0">
                            <p className={`text-xs font-bold uppercase tracking-[0.12em] ${mutedText}`}>
                              {blog.category}
                            </p>

                            <h4 className="mt-1 line-clamp-2 text-sm font-bold leading-6 text-[var(--mc-text-main)] group-hover:text-orange-500 md:text-slate-900 md:group-hover:text-orange-600">
                              {blog.title}
                            </h4>

                            <p className={`mt-2 text-xs ${mutedText}`}>
                              {formatDate(blog.publishedAt || blog.createdAt)}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-10 md:mt-14">
                <div className="mb-6 text-center md:mb-8">
                  <span className="inline-flex rounded-full bg-orange-50 px-4 py-1 text-xs font-bold uppercase tracking-[0.18em] text-orange-600">
                    Latest Articles
                  </span>

                  <h2 className={`mt-4 text-2xl font-extrabold md:text-4xl ${headingText}`}>
                    Read the newest stories
                  </h2>

                  <p className={`mx-auto mt-3 max-w-2xl text-sm leading-7 md:text-base ${mutedText}`}>
                    Thoughtful reads designed with a clean editorial layout and
                    a modern professional look.
                  </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
                  {otherBlogs.map((blog) => (
                    <Link
                      key={blog._id}
                      to={`/blog/${blog.slug}`}
                      className={`group overflow-hidden rounded-[24px] shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl md:rounded-[28px] ${cardBg}`}
                    >
                      <div className="h-52 overflow-hidden bg-slate-200 md:h-56">
                        <img
                          src={getBlogImage(blog.image)}
                          alt={blog.title}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        />
                      </div>

                      <div className="p-5 md:p-6">
                        <div className={`flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] ${mutedText}`}>
                          <span>{blog.category}</span>
                          <span>•</span>
                          <span>{blog.readTime || "5 min read"}</span>
                        </div>

                        <h3 className="mt-4 line-clamp-2 text-xl font-extrabold leading-8 text-[var(--mc-text-main)] group-hover:text-orange-500 md:text-slate-950 md:group-hover:text-orange-600">
                          {blog.title}
                        </h3>

                        <p className={`mt-3 line-clamp-3 text-sm leading-7 ${bodyText}`}>
                          {blog.excerpt}
                        </p>

                        <div className={`mt-5 flex flex-wrap items-center justify-between gap-3 text-sm md:mt-6 ${mutedText}`}>
                          <span>{blog.author || "Admin"}</span>
                          <span>
                            {formatDate(blog.publishedAt || blog.createdAt)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </>
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

export default Blog;