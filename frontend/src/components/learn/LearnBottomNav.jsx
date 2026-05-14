import { History, Home, LayoutGrid } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { label: "Home", icon: Home, to: "/learn" },
  { label: "Courses", icon: LayoutGrid, to: "/courses" },
  { label: "History", icon: History, to: "/history" },
];

function LearnBottomNav() {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#09101d]/95 backdrop-blur-xl md:hidden">
      <div className="grid grid-cols-3 px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.to;

          return (
            <Link
              key={item.label}
              to={item.to}
              className={`flex flex-col items-center justify-center rounded-2xl py-2 text-xs ${
                active ? "text-cyan-300" : "text-white/55"
              }`}
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

export default LearnBottomNav;