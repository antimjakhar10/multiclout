import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { HiOutlineMenuAlt3, HiOutlineX } from "react-icons/hi";
import {
  UserCircle2,
  LogOut,
  ShoppingBag,
  Home,
  BriefcaseBusiness,
  GraduationCap,
  Handshake,
  Newspaper,
  Phone,
  Info,
  ShieldCheck,
  Sun,
  Crown,
  Moon,
  Video,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import {
  getMobileTheme,
  toggleMobileTheme,
  applyMobileTheme,
} from "../utils/mobileTheme";
import logo from "../assets/multiclout-logo.png";

const desktopNavLinks = [
  { label: "Watch Videos", path: "/watch-videos" },
  { label: "Creator Videos", path: "/creator-videos" },
  { label: "Business Plan", path: "/business-plan" },
  { label: "Tutorials", path: "/tutorials" },
  { label: "Franchise", path: "/franchise" },
  { label: "Become a Member", path: "/become-a-member" },
];

const mobileNavLinks = [
  { label: "Home", path: "/", icon: Home },
  { label: "Creator Videos", path: "/creator-videos", icon: Video },
  { label: "Business Plan", path: "/business-plan", icon: BriefcaseBusiness },
  { label: "Tutorials", path: "/tutorials", icon: GraduationCap },
  { label: "Franchise", path: "/franchise", icon: Handshake },
  { label: "Blog", path: "/blog", icon: Newspaper },
  { label: "About Us", path: "/about", icon: Info },
  { label: "Contact", path: "/contact", icon: Phone },
  { label: "Become a Member", path: "/become-a-member", icon: Crown },
  {
    label: "Terms & Conditions",
    path: "/terms-and-conditions",
    icon: ShieldCheck,
  },
];

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useCart();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [mobileTheme, setMobileTheme] = useState(getMobileTheme());

  const closeMenu = () => setMobileMenuOpen(false);

  useEffect(() => {
    applyMobileTheme(getMobileTheme());

    const syncAuth = () => {
      const token =
        localStorage.getItem("userToken") || localStorage.getItem("token");
      const user = localStorage.getItem("user");
      setLoggedIn(!!token && !!user);
    };

    syncAuth();
    window.addEventListener("storage", syncAuth);
    window.addEventListener("focus", syncAuth);

    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("focus", syncAuth);
    };
  }, []);

  const handleThemeToggle = () => {
    const next = toggleMobileTheme();
    setMobileTheme(next);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");
    localStorage.removeItem("verifiedPhoneForRegister");
    localStorage.removeItem("registerMockOtp");
    setLoggedIn(false);
    closeMenu();
    navigate("/login");
  };

  const isMobileActive = (path) => {
    if (path === "/") {
      return location.pathname === "/" || location.pathname === "/watch-videos";
    }

    return location.pathname === path;
  };

  return (
    <header
      className="sticky top-0 z-50 border-b shadow-sm backdrop-blur-xl"
      style={{
        background: "var(--mc-nav-bg)",
        borderColor: "var(--mc-border)",
      }}
    >
      <div className="mx-auto flex min-h-[74px] w-full max-w-[1440px] items-center justify-between gap-3 px-4 sm:min-h-[80px] sm:px-5 md:px-6 lg:px-8 xl:px-10">
        <Link to="/" className="flex shrink-0 items-center" onClick={closeMenu}>
          <img
            src={logo}
            alt="Multiclout Logo"
            className="h-10 w-auto object-contain sm:h-11 lg:h-12"
          />
        </Link>

        <nav className="hidden items-center gap-7 xl:flex 2xl:gap-8">
          {desktopNavLinks.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className="group relative whitespace-nowrap text-[15px] font-semibold text-gray-700 transition-all duration-300 hover:text-[#167a7a]"
            >
              {({ isActive }) => (
                <span className={isActive ? "text-[#167a7a]" : "text-gray-700"}>
                  {item.label}
                  <span
                    className={`absolute -bottom-2 left-0 h-[2px] bg-[#167a7a] transition-all duration-300 ${
                      isActive
                        ? "w-full opacity-100"
                        : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                    }`}
                  />
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-2 md:flex lg:gap-3">
          <a
            href="#"
           className="hidden rounded-full border border-gray-300 bg-gray-100 px-4 py-2.5 text-sm font-semibold !text-[#0f172a] transition-all duration-300 hover:border-[#167a7a] hover:bg-[#167a7a] hover:!text-white lg:inline-flex xl:px-6 xl:py-3"
          >
            Download App
          </a>

          <Link
            to="/cart"
            aria-label="Shopping Cart"
            className="relative inline-flex h-[46px] w-[46px] items-center justify-center rounded-full border border-gray-300 bg-white !text-[#0f172a] transition-all duration-300 hover:border-[#167a7a] hover:bg-[#167a7a] hover:!text-white"
          >
            <ShoppingBag size={19} />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold leading-none text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          {loggedIn ? (
            <>
              <Link
                to="/account"
                className="inline-flex h-[46px] w-[46px] items-center justify-center rounded-full border border-gray-300 bg-white !text-[#0f172a] transition-all duration-300 hover:border-[#167a7a] hover:bg-[#167a7a] hover:!text-white"
              >
                <UserCircle2 size={20} />
              </Link>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2d7084] to-[#4d9a97] px-4 py-2.5 text-sm font-semibold !text-white shadow-[0_12px_24px_rgba(45,112,132,0.25)] transition-all duration-300 hover:scale-[1.03] xl:px-5 xl:py-3"
              >
                <LogOut size={17} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="inline-flex rounded-full border border-gray-300 px-4 py-2.5 text-sm font-semibold !text-[#0f172a] transition-all duration-300 hover:border-[#167a7a] hover:bg-[#167a7a] hover:!text-white xl:px-5 xl:py-3"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="inline-flex rounded-full bg-gradient-to-r from-[#2d7084] to-[#4d9a97] px-4 py-2.5 text-sm font-semibold !text-white shadow-[0_12px_24px_rgba(45,112,132,0.25)] transition-all duration-300 hover:scale-[1.03] xl:px-5 xl:py-3"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={handleThemeToggle}
            aria-label="Toggle theme"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300"
            style={{
              background: "var(--mc-bg-card-strong)",
              borderColor: "var(--mc-border)",
              color: "var(--mc-text-main)",
            }}
          >
            {mobileTheme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          <Link
            to="/cart"
            aria-label="Shopping Cart"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300"
            style={{
              background: "var(--mc-bg-card-strong)",
              borderColor: "var(--mc-border)",
              color: "var(--mc-text-main)",
            }}
          >
            <ShoppingBag size={17} />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold leading-none text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300"
            style={{
              background: "var(--mc-bg-card-strong)",
              borderColor: "var(--mc-border)",
              color: "var(--mc-text-main)",
            }}
          >
            {mobileMenuOpen ? (
              <HiOutlineX className="text-[21px]" />
            ) : (
              <HiOutlineMenuAlt3 className="text-[21px]" />
            )}
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden border-t transition-all duration-300 md:hidden ${
          mobileMenuOpen
            ? "max-h-[calc(100vh-74px)] opacity-100 overflow-y-auto"
            : "max-h-0 opacity-0"
        }`}
        style={{
          background: "var(--mc-bg-soft)",
          borderColor: "var(--mc-border)",
          color: "var(--mc-text-main)",
        }}
      >
        <div className="px-4 pb-28 pt-4 sm:px-5">
          <nav className="grid grid-cols-1 gap-2">
            {mobileNavLinks.map((item) => {
              const Icon = item.icon;
              const active = isMobileActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-300"
                  style={{
                    background: active ? "#167a7a" : "var(--mc-bg-card)",
                    color: active ? "#ffffff" : "var(--mc-text-main)",
                    border: "1px solid var(--mc-border)",
                  }}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div
            className="mt-5 flex flex-col gap-3 border-t pt-4"
            style={{ borderColor: "var(--mc-border)" }}
          >
            {loggedIn ? (
              <>
                <Link
                  to="/account"
                  onClick={closeMenu}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2d7084] to-[#4d9a97] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(45,112,132,0.25)]"
                >
                  <UserCircle2 size={18} />
                  My Account
                </Link>

                <button
                  onClick={handleLogout}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition-all duration-300"
                  style={{
                    borderColor: "var(--mc-border)",
                    color: "var(--mc-text-main)",
                    background: "var(--mc-bg-card)",
                  }}
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#2d7084] to-[#4d9a97] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(45,112,132,0.25)]"
                >
                  Register
                </Link>

                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="inline-flex w-full items-center justify-center rounded-full border px-5 py-3 text-sm font-semibold transition-all duration-300"
                  style={{
                    borderColor: "var(--mc-border)",
                    color: "var(--mc-text-main)",
                    background: "var(--mc-bg-card)",
                  }}
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
