import { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../../utils/api";

function UsersAdmin() {
  const token = localStorage.getItem("adminToken");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API}/users/admin/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        setUsers(res.data.users || []);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await axios.delete(`${API}/users/admin/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchUsers();
    } catch (error) {
      alert("Failed to delete user");
    }
  };

  const exportUsersCSV = () => {
  if (!users.length) {
    alert("No users to export");
    return;
  }

  const headers = ["Name", "Email", "Phone", "Verified", "Created"];

  const rows = users.map((item) => [
    item.name || "-",
    item.email || "-",
    item.phone || "-",
    item.isVerified ? "Verified" : "Pending",
    item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "-",
  ]);

  const csvContent = [headers, ...rows]
    .map((row) =>
      row
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `registered-users-${new Date()
    .toISOString()
    .slice(0, 10)}.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-[1400px] p-4 md:p-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm text-slate-600">
          Loading users...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] p-4 md:p-6">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4 md:px-6">
  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-[#07111a]">
        Registered Users
      </h1>
      <p className="mt-2 text-sm md:text-base text-slate-600">
        Users who have completed OTP verification will be listed here.
      </p>
    </div>

    <button
      type="button"
      onClick={exportUsersCSV}
      className="inline-flex h-11 items-center justify-center rounded-xl bg-[#07111a] px-5 text-sm font-semibold text-white transition hover:bg-[#0b1d2d] disabled:cursor-not-allowed disabled:opacity-60"
      disabled={!users.length}
    >
      Export CSV
    </button>
  </div>
</div>

        <div className="p-5 md:p-6">
          {users.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-slate-500">
              No users found.
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50 text-left">
                    <tr className="border-b border-slate-200">
                      <th className="px-4 py-4 font-semibold text-[#07111a]">Name</th>
                      <th className="px-4 py-4 font-semibold text-[#07111a]">Email</th>
                      <th className="px-4 py-4 font-semibold text-[#07111a]">Phone</th>
                      <th className="px-4 py-4 font-semibold text-[#07111a]">Verified</th>
                      <th className="px-4 py-4 font-semibold text-[#07111a]">Created</th>
                      <th className="px-4 py-4 font-semibold text-[#07111a]">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200 bg-white">
                    {users.map((item) => (
                      <tr key={item._id} className="align-top">
                        <td className="px-4 py-4 text-slate-700">{item.name || "-"}</td>
                        <td className="px-4 py-4 text-slate-700">{item.email || "-"}</td>
                        <td className="px-4 py-4 text-slate-700">{item.phone || "-"}</td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              item.isVerified
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {item.isVerified ? "Verified" : "Pending"}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-slate-700">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => deleteUser(item._id)}
                            className="inline-flex h-11 items-center justify-center rounded-xl bg-red-500 px-4 text-sm font-medium text-white transition hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UsersAdmin;