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
      className="fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-xl md:hidden"
      style={{
        background: "var(--mc-bg-soft)",
        borderColor: "var(--mc-border)",
      }}
    >
      <div className="grid grid-cols-3 px-3 py-2.5">
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
              <Icon size={18} />
              <span className="mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default MobileBottomNav;