import { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  UserCircle2,
  CreditCard,
  Headphones,
  Trash2,
  LogOut,
  Menu,
  X,
  UploadCloud,
  BookOpenCheck,
} from "lucide-react";
import { API } from "../../utils/videoHelpers";
import logo from "../../assets/multiclout-logo.png";

const navLinks = [
  {
    label: "Dashboard",
    to: "/account",
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "My Courses",
    to: "/account/my-courses",
    icon: BookOpenCheck,
  },
  {
    label: "Upload Video",
    to: "/account/upload-video",
    icon: UploadCloud,
  },
  {
    label: "Profile",
    to: "/account/profile",
    icon: UserCircle2,
  },
  {
    label: "Subscription",
    to: "/account/subscription",
    icon: CreditCard,
  },
  {
    label: "Support",
    to: "/account/help-support",
    icon: Headphones,
  },
  {
    label: "Delete Account",
    to: "/account/delete-account",
    icon: Trash2,
  },
];

function UserPanelLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const syncUser = async () => {
      try {
        const token =
          localStorage.getItem("userToken") || localStorage.getItem("token");

        if (!token) return;

        const res = await fetch(`${API}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok && data.success && data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
          setUser(data.user);
        }
      } catch (error) {
        console.error("Failed to sync user:", error);
      }
    };

    syncUser();
  }, [location.pathname]);

  const userInitial = useMemo(() => {
    return user?.name?.trim()?.charAt(0)?.toUpperCase() || "U";
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");
    localStorage.removeItem("verifiedPhoneForRegister");
    localStorage.removeItem("registerMockOtp");
    navigate("/login");
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#07111a_0%,#0b1724_100%)] text-white">
      <div className="mx-auto flex min-h-screen max-w-[1450px]">
        {sidebarOpen && (
          <button
            onClick={closeSidebar}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          />
        )}

        <aside
          className={`fixed left-0 top-0 z-50 h-screen w-[270px] border-r border-white/10 bg-[#08111a]/96 backdrop-blur-xl transition-transform duration-300 lg:sticky lg:z-10 lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
              <button
                onClick={() => navigate("/")}
                className="flex items-center"
              >
                <img
                  src={logo}
                  alt="Multiclout"
                  className="h-10 w-auto object-contain"
                />
              </button>

              <button
                onClick={closeSidebar}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 lg:hidden"
              >
                <X size={17} />
              </button>
            </div>

            <div className="border-b border-white/10 px-5 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 text-base font-bold text-white">
                  {userInitial}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-[15px] font-semibold text-white">
                    {user?.name || "Multiclout User"}
                  </p>
                  <p className="truncate text-xs text-white/55">
                    {user?.phone || user?.email || "Logged in user"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-5">
              <div className="space-y-2">
                {navLinks.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      onClick={closeSidebar}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                          isActive
                            ? "bg-gradient-to-r from-cyan-500/18 to-emerald-500/18 text-white ring-1 ring-cyan-400/20"
                            : "text-white/72 hover:bg-white/[0.05] hover:text-white"
                        }`
                      }
                    >
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
                        <Icon size={17} />
                      </span>
                      {item.label}
                    </NavLink>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-white/10 p-4">
              <button
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.07]"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="sticky top-0 z-30 border-b border-white/10 bg-[#07111a]/88 backdrop-blur-xl">
            <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white lg:hidden"
                >
                  <Menu size={18} />
                </button>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.20em] text-cyan-300/85">
                    User Panel
                  </p>
                  <h1 className="mt-1 text-lg font-semibold text-white sm:text-xl">
                    {location.pathname === "/account"
                      ? "Dashboard"
                      : location.pathname.includes("/my-courses")
                        ? "My Courses"
                        : location.pathname.includes("/upload-video")
                          ? "Upload Video"
                          : location.pathname.includes("/profile")
                            ? "Profile"
                            : location.pathname.includes("/subscription")
                              ? "Subscription"
                              : location.pathname.includes("/help-support")
                                ? "Help & Support"
                                : location.pathname.includes("/delete-account")
                                  ? "Delete Account"
                                  : "Account"}
                  </h1>
                </div>
              </div>

              <button
                onClick={() => navigate("/watch-videos")}
                className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-white/90 transition hover:bg-white/[0.07] sm:text-sm"
              >
                Watch Videos
              </button>
            </div>
          </div>

          <main className="px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default UserPanelLayout;
