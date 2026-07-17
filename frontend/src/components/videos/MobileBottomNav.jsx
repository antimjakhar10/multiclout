import { History, Home, BookOpen } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

function MobileBottomNav() {
  const location = useLocation();

  const navItems = [
    { label: "Home", icon: Home, to: "/" },
    { label: "Courses", icon: BookOpen, to: "/courses" },
    { label: "History", icon: History, to: "/history" },
  ];

  const isActive = (to) => {
    if (to === "/") {
      return location.pathname === "/" || location.pathname === "/watch-videos";
    }

    if (to === "/courses") {
      return location.pathname === "/courses";
    }

    return location.pathname === to;
  };

  return (
    <div
      className="fixed inset-x-0 bottom-2 z-50 px-3 md:hidden"
      style={{
        background: "var(--mc-bg-soft)",
        borderColor: "var(--mc-border)",

        // iPhone + Android Safe Area
        paddingBottom: "max(env(safe-area-inset-bottom), 12px)",

        // Navbar ki normal height
        minHeight: "72px",
      }}
    >
      <div className="grid grid-cols-3 px-3 pt-2 pb-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.to);

          return (
            <Link
              key={item.label}
              to={item.to}
              className="flex flex-col items-center justify-center rounded-2xl py-2 text-[11px] font-medium transition"
              style={{
                color: active ? "#22d3ee" : "var(--mc-text-soft)",
              }}
            >
              <Icon size={20} />
              <span className="mt-1 text-[12px]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default MobileBottomNav;
