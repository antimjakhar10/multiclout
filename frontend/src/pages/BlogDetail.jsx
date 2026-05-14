import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MobileBottomNav from "../components/videos/MobileBottomNav";
import MobileAppHeader from "../components/videos/MobileAppHeader";
import { API } from "../utils/api";
import { getImageUrl } from "../utils/videoHelpers";
import SEO from "../components/SEO";


function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const pageBg =
    "bg-[var(--mc-bg-main)] text-[var(--mc-text-main)] md:bg-[#f7f8fb] md:text-[#0f172a]";
  const cardBg =
    "border border-[var(--mc-border)] bg-[var(--mc-bg-card)] text-[var(--mc-text-main)] md:border-[#e5e7eb] md:bg-white md:text-[#0f172a]";
  const headingText = "text-[var(--mc-text-main)] md:text-[#0f172a]";
  const bodyText = "text-[var(--mc-text-soft)] md:text-[#334155]";
  const mutedText = "text-[var(--mc-text-soft)] md:text-[#64748b]";

  useEffect(() => {
    fetchBlog();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/blogs/${slug}`);
      const data = await res.json();

      if (data.success) {
        setBlog(data.blog);
        setRelatedBlogs(data.relatedBlogs || []);
      }
    } catch (error) {
      console.error("Failed to fetch blog detail:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen pb-24 md:pb-0 ${pageBg}`}>
        <div className="hidden md:block">
          <Navbar />
        </div>

        <div className="md:hidden">
          <MobileAppHeader />
        </div>

        <div className="px-4 pt-20 text-center text-sm font-medium text-[var(--mc-text-soft)] md:pt-32 md:text-lg md:text-[#334155]">
          Loading blog...
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className={`min-h-screen pb-24 md:pb-0 ${pageBg}`}>
        <div className="hidden md:block">
          <Navbar />
        </div>

        <div className="md:hidden">
          <MobileAppHeader />
        </div>

        <div className="px-4 pt-20 text-center md:pt-32">
          <h2 className={`text-2xl font-bold ${headingText}`}>
            Blog not found
          </h2>

          <Link
            to="/blog"
            className="mt-4 inline-block rounded-full bg-[#07111a] px-6 py-3 text-sm font-semibold text-white"
          >
            Back to Blog
          </Link>
        </div>

        <div className="md:hidden">
          <MobileBottomNav />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-24 md:pb-0 ${pageBg}`}>
      <SEO
        title={blog?.seoTitle || blog?.title || "Blog"}
        description={
          blog?.seoDescription ||
          blog?.excerpt ||
          "Read latest articles on Multiclout"
        }
        keywords={
          blog?.seoKeywords ||
          `${blog?.title || ""}, ${blog?.category || ""}, Multiclout blog`
        }
      />
      <div className="sticky top-0 z-[100] hidden md:block bg-white shadow-sm">
        <Navbar />
      </div>

      <div className="md:hidden">
        <MobileAppHeader />
      </div>

      <section className="bg-[#07111a] px-4 pb-12 pt-8 md:px-0 md:pb-16 md:pt-20">
        <div className="mx-auto max-w-5xl text-center sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
            {blog.category}
          </p>

          <h1 className="mt-4 text-[30px] font-bold leading-tight text-white md:mt-5 md:text-5xl">
            {blog.title}
          </h1>

          <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-white/70 md:mt-5 md:text-lg">
            {blog.excerpt}
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-white/70 md:mt-6 md:gap-3 md:text-sm">
            <span>By {blog.author || "Admin"}</span>
            <span>•</span>
            <span>{blog.readTime || "5 min read"}</span>
            <span>•</span>
            <span>
              {new Date(
                blog.publishedAt || blog.createdAt,
              ).toLocaleDateString()}
            </span>
          </div>
        </div>
      </section>

      <section className="-mt-7 pb-12 md:-mt-8 md:pb-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div
            className={`overflow-hidden rounded-[26px] shadow-sm md:rounded-[32px] ${cardBg}`}
          >
            <img
              src={getBlogImage(blog.image)}
              alt={blog.title}
              className="h-[230px] w-full object-cover md:h-[460px]"
            />

            <div className="p-5 md:p-10">
              <div className="prose prose-slate max-w-none">
                <div
                  className={`whitespace-pre-line text-[15px] leading-8 md:text-[16px] ${bodyText}`}
                >
                  {blog.content}
                </div>
              </div>

              {blog.tags?.length > 0 && (
                <div className="mt-8 border-t border-[var(--mc-border)] pt-5 md:mt-10 md:border-[#e5e7eb] md:pt-6">
                  <h3 className={`text-lg font-semibold ${headingText}`}>
                    Tags
                  </h3>

                  <div className="mt-4 flex flex-wrap gap-3">
                    {blog.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-[var(--mc-chip-bg)] px-4 py-2 text-sm font-medium text-[var(--mc-text-main)] md:bg-[#f1f5f9] md:text-[#334155]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {relatedBlogs.length > 0 && (
            <div className="mt-10 md:mt-12">
              <div className="text-center">
                <h2 className={`text-2xl font-bold md:text-3xl ${headingText}`}>
                  Related Articles
                </h2>
              </div>

              <div className="mt-6 grid gap-5 md:mt-8 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
                {relatedBlogs.map((item) => (
                  <Link
                    key={item._id}
                    to={`/blog/${item.slug}`}
                    className={`overflow-hidden rounded-[24px] shadow-sm transition hover:-translate-y-1 hover:shadow-xl md:rounded-[28px] ${cardBg}`}
                  >
                    <img
                      src={getBlogImage(item.image)}
                      alt={item.title}
                      className="h-48 w-full object-cover md:h-52"
                    />

                    <div className="p-5">
                      <p
                        className={`text-xs font-semibold uppercase tracking-[0.16em] ${mutedText}`}
                      >
                        {item.category}
                      </p>

                      <h3
                        className={`mt-3 line-clamp-2 text-lg font-bold ${headingText}`}
                      >
                        {item.title}
                      </h3>

                      <p
                        className={`mt-3 line-clamp-3 text-sm leading-7 md:text-[#475569] ${bodyText}`}
                      >
                        {item.excerpt}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
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

export default BlogDetail;
