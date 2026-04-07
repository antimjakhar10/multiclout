import { Link, NavLink } from "react-router-dom";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Watch Videos", path: "/watch-videos" },
  { label: "Business Plan", path: "/business-plan" },
  { label: "Tutorials", path: "/tutorials" },
  { label: "Franchise", path: "/franchise" },
  { label: "Blog", path: "/blog" },
];

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07111a]/92 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[84px] w-full max-w-[1600px] items-center justify-between gap-6 px-6 lg:px-10 xl:px-14 2xl:px-16">
        <Link to="/" className="flex min-w-fit items-center gap-3 sm:gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2d7084] via-[#4d9a97] to-[#7bc0b0] shadow-[0_10px_30px_rgba(45,112,132,0.35)]">
            <span className="text-lg font-bold text-white">M</span>
          </div>

          <div>
            <h1 className="text-[22px] font-bold leading-none text-white">
              Multiclout
            </h1>
            <p className="mt-1 text-[11px] font-medium tracking-[0.22em] text-white/65 sm:text-xs">
              LEARN • BUILD • GROW
            </p>
          </div>
        </Link>

        <nav className="hidden xl:flex items-center gap-8 2xl:gap-10 flex-nowrap">
          {navLinks.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `whitespace-nowrap text-[15px] font-medium transition ${
                  isActive ? "text-white" : "text-white/80 hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <button className="hidden rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white/90 transition hover:bg-white/10 lg:block whitespace-nowrap">
            Download App
          </button>

          <Link
            to="/login"
            className="hidden rounded-full border border-white/12 px-5 py-3 text-sm font-medium text-white/90 transition hover:bg-white/5 lg:block whitespace-nowrap"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="rounded-full bg-gradient-to-r from-[#2d7084] to-[#4d9a97] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(45,112,132,0.28)] transition hover:opacity-95 whitespace-nowrap"
          >
            Register
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;