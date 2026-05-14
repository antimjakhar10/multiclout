import { Menu, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

function AdminHeader({ setOpen }) {
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem("adminUser") || "null");

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  return (
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          className="rounded-xl border border-slate-200 p-2 text-slate-700 lg:hidden"
          onClick={() => setOpen(true)}
        >
          <Menu size={20} />
        </button>

        <div>
          <h1 className="text-lg font-semibold text-slate-900">Admin Panel</h1>
          <p className="text-sm text-slate-500">Manage your website content</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 md:block">
          <p className="text-sm font-medium text-slate-800">
            {admin?.name || "Admin"}
          </p>
          <p className="text-xs text-slate-500">{admin?.email || ""}</p>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  );
}

export default AdminHeader;