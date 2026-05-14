import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  MessageSquareQuote,
  CircleHelp,
  BadgeCheck,
  PlaySquare,
  Video,
  Settings,
  Mail,
  X,
  FileText,
  BriefcaseBusiness,
  ClipboardList,
  BarChart3,
  MonitorPlay,
  UploadCloud,
  WalletCards,
} from "lucide-react";

const links = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Courses", to: "/admin/courses", icon: BookOpen },
  { label: "Tutorials", to: "/admin/tutorials", icon: PlaySquare },
  { label: "Mentors", to: "/admin/mentors", icon: Users },
  { label: "Testimonials", to: "/admin/testimonials", icon: MessageSquareQuote },
  { label: "FAQs", to: "/admin/faqs", icon: CircleHelp },
  { label: "Reasons", to: "/admin/reasons", icon: BadgeCheck },
  { label: "Videos", to: "/admin/videos", icon: Video },
  { label: "User Videos", to: "/admin/user-videos", icon: UploadCloud },
  { label: "Hero Section", to: "/admin/hero-section", icon: MonitorPlay },
  { label: "Hero Stats", to: "/admin/stats", icon: BarChart3 },
  { label: "Registered Users", to: "/admin/users", icon: Users },
  { label: "Site Settings", to: "/admin/site-settings", icon: Settings },
  { label: "Plans", to: "/admin/plans", icon: WalletCards },
  { label: "Contact Enquiries", to: "/admin/contact-enquiries", icon: Mail },
  { label: "Blogs", to: "/admin/blogs", icon: FileText },
  { label: "Franchise", to: "/admin/franchise", icon: BriefcaseBusiness },
  { label: "Franchise Enquiries", to: "/admin/franchise-enquiries", icon: ClipboardList },
];

function AdminSidebar({ open, setOpen }) {
  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-black/50 lg:hidden ${
          open ? "block" : "hidden"
        }`}
        onClick={() => setOpen(false)}
      />

      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-[280px] flex-col border-r border-white/10 bg-[#0b1220] text-white transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-white/10 px-6">
          <div>
            <h2 className="text-xl font-bold tracking-wide text-white">
              MULTICLOUT
            </h2>
            <p className="text-xs text-white/60">Admin Panel</p>
          </div>

          <button
            className="rounded-lg p-2 text-white/70 hover:bg-white/10 lg:hidden"
            onClick={() => setOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

       <nav
  className="sidebar-scroll flex-1 overflow-y-auto px-4 py-4"
  style={{
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  }}
>
          <div className="space-y-2 pb-6">
            {links.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/admin"}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg"
                        : "text-white/75 hover:bg-white/10 hover:text-white"
                    }`
                  }
                  onClick={() => setOpen(false)}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>
      </aside>
    </>
  );
}

export default AdminSidebar;