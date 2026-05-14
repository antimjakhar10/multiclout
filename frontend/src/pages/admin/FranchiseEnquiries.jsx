import { useEffect, useState } from "react";
import { API } from "../../utils/api";

function FranchiseEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API}/franchise/enquiries`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (result.success) {
        setEnquiries(result.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch franchise enquiries", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${API}/franchise/enquiries/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const result = await res.json();

      if (result.success) {
        fetchEnquiries();
      } else {
        alert(result.message || "Failed to update status");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update enquiry status");
    }
  };

  const exportCSV = () => {
  if (!enquiries.length) {
    alert("No enquiries to export");
    return;
  }

  const headers = [
    "Name",
    "Email",
    "Phone",
    "City",
    "Investment Range",
    "Message",
    "Date",
    "Status",
  ];

  const rows = enquiries.map((item) => [
    item.name || "-",
    item.email || "-",
    item.phone || "-",
    item.city || "-",
    item.investmentRange || "-",
    item.message || "-",
    item.createdAt ? new Date(item.createdAt).toLocaleString() : "-",
    item.status || "-",
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
  link.download = `franchise-enquiries-${new Date()
    .toISOString()
    .slice(0, 10)}.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

  if (loading) {
    return (
      <div className="p-4 md:p-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm text-slate-600">
          Loading enquiries...
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
        Franchise Enquiries
      </h1>
      <p className="mt-2 text-sm md:text-base text-slate-600">
        All enquiries submitted through the franchise page will be displayed here.
      </p>
    </div>

    <button
      type="button"
      onClick={exportCSV}
      disabled={!enquiries.length}
      className="inline-flex h-11 items-center justify-center rounded-xl bg-[#07111a] px-5 text-sm font-semibold text-white transition hover:bg-[#0b1d2d] disabled:cursor-not-allowed disabled:opacity-60"
    >
      Export CSV
    </button>
  </div>
</div>

        <div className="p-5 md:p-6">
          {enquiries.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-slate-500">
              No franchise enquiries found.
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
                      <th className="px-4 py-4 font-semibold text-[#07111a]">City</th>
                      <th className="px-4 py-4 font-semibold text-[#07111a]">Investment Range</th>
                      <th className="px-4 py-4 font-semibold text-[#07111a]">Message</th>
                      <th className="px-4 py-4 font-semibold text-[#07111a]">Date</th>
                      <th className="px-4 py-4 font-semibold text-[#07111a]">Status</th>
                      <th className="px-4 py-4 font-semibold text-[#07111a]">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200 bg-white">
                    {enquiries.map((item) => (
                      <tr key={item._id} className="align-top">
                        <td className="px-4 py-4 text-slate-700">{item.name}</td>
                        <td className="px-4 py-4 text-slate-700">{item.email}</td>
                        <td className="px-4 py-4 text-slate-700">{item.phone}</td>
                        <td className="px-4 py-4 text-slate-700">{item.city}</td>
                        <td className="px-4 py-4 text-slate-700 whitespace-nowrap">
  {item.investmentRange || "-"}
</td>
                        <td className="max-w-[280px] whitespace-pre-wrap px-4 py-4 text-slate-700">
                          {item.message}
                        </td>
                        <td className="px-4 py-4 text-slate-700 whitespace-nowrap">
                          {new Date(item.createdAt).toLocaleString()}
                        </td>
                        <td className="px-4 py-4">
                          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-700">
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <select
                            value={item.status}
                            onChange={(e) => updateStatus(item._id, e.target.value)}
                            className="h-11 min-w-[140px] rounded-xl border border-slate-300 bg-white px-3 text-sm text-[#07111a] outline-none transition focus:border-[#167a7a] focus:ring-2 focus:ring-[#167a7a]/10"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="closed">Closed</option>
                          </select>
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

export default FranchiseEnquiries;