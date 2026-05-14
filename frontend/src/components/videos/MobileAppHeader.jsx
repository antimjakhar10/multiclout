import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Moon,
  Sun,
  ShoppingBag,
  Menu,
  X,
  Home,
  BriefcaseBusiness,
  GraduationCap,
  Handshake,
  Newspaper,
  Info,
  Phone,
  ShieldCheck,
  UserCircle2,
  LogOut,
} from "lucide-react";
import logo from "../../assets/multiclout-logo.png";
import { useCart } from "../../context/CartContext";
import {
  applyMobileTheme,
  getMobileTheme,
  toggleMobileTheme,
} from "../../utils/mobileTheme";

const mobileNavLinks = [
  { label: "Home", path: "/", icon: Home },
  { label: "Business Plan", path: "/business-plan", icon: BriefcaseBusiness },
  { label: "Tutorials", path: "/tutorials", icon: GraduationCap },
  { label: "Franchise", path: "/franchise", icon: Handshake },
  { label: "Blog", path: "/blog", icon: Newspaper },
  { label: "About Us", path: "/about", icon: Info },
  { label: "Contact", path: "/contact", icon: Phone },
  { label: "Terms & Conditions", path: "/terms-and-conditions", icon: ShieldCheck },
];

function MobileAppHeader({
  showSearch = false,
  searchValue = "",
  setSearchValue = () => {},
  searchPlaceholder = "Search videos",
}) {
  const navigate = useNavigate();
  const { cartCount } = useCart();

  const [theme, setTheme] = useState("dark");
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const savedTheme = getMobileTheme();
    setTheme(savedTheme);
    applyMobileTheme(savedTheme);

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

  const closeMenu = () => setMenuOpen(false);

  const handleThemeToggle = () => {
    const next = toggleMobileTheme();
    setTheme(next);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");
    localStorage.removeItem("verifiedPhoneForRegister");
    localStorage.removeItem("registerMockOtp");
    closeMenu();
    setLoggedIn(false);
    navigate("/login");
  };

  return (
    <div
      className="sticky top-0 z-50 border-b backdrop-blur-xl md:hidden"
      style={{
        background: "var(--mc-bg-soft)",
        borderColor: "var(--mc-border)",
        color: "var(--mc-text-main)",
      }}
    >
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate("/")} className="shrink-0">
            <img
              src={logo}
              alt="Multiclout"
              className="h-10 w-auto object-contain"
            />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleThemeToggle}
              className="flex h-10 w-10 items-center justify-center rounded-full border transition"
              style={{
                background: "var(--mc-bg-card-strong)",
                borderColor: "var(--mc-border)",
                color: "var(--mc-text-main)",
              }}
            >
              {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            <Link
              to="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border transition"
              style={{
                background: "var(--mc-bg-card-strong)",
                borderColor: "var(--mc-border)",
                color: "var(--mc-text-main)",
              }}
            >
              <ShoppingBag size={17} />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex h-10 w-10 items-center justify-center rounded-full border transition"
              style={{
                background: "var(--mc-bg-card-strong)",
                borderColor: "var(--mc-border)",
                color: "var(--mc-text-main)",
              }}
            >
              {menuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>

        {showSearch && (
          <div className="relative mt-3">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: "var(--mc-text-faint)" }}
            />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={searchPlaceholder}
              className="h-11 w-full rounded-[18px] border pl-11 pr-4 text-[14px] outline-none"
              style={{
                background: "var(--mc-input-bg)",
                borderColor: "var(--mc-border)",
                color: "var(--mc-text-main)",
              }}
            />
          </div>
        )}


        
      </div>

      <div
        className={`overflow-hidden border-t transition-all duration-300 ${
          menuOpen ? "max-h-[760px] opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{
          background: "var(--mc-bg-soft)",
          borderColor: "var(--mc-border)",
        }}
      >
        <div className="px-4 py-4">
          <nav className="grid gap-2">
            {mobileNavLinks.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold"
                  style={{
                    background: "var(--mc-bg-card)",
                    color: "var(--mc-text-main)",
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
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2d7084] to-[#4d9a97] px-5 py-3 text-sm font-semibold text-white"
                >
                  <UserCircle2 size={18} />
                  My Account
                </Link>

                <button
                  onClick={handleLogout}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold"
                  style={{
                    background: "var(--mc-bg-card)",
                    borderColor: "var(--mc-border)",
                    color: "var(--mc-text-main)",
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
                  className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#2d7084] to-[#4d9a97] px-5 py-3 text-sm font-semibold text-white"
                >
                  Register
                </Link>

                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="inline-flex w-full items-center justify-center rounded-full border px-5 py-3 text-sm font-semibold"
                  style={{
                    background: "var(--mc-bg-card)",
                    borderColor: "var(--mc-border)",
                    color: "var(--mc-text-main)",
                  }}
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MobileAppHeader;