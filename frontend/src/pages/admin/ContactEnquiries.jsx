import { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../../utils/api";

function ContactEnquiries() {
  const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const res = await axios.get(`${API}/site-settings/contact-enquiries`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        setEnquiries(res.data.enquiries || []);
      }
    } catch (error) {
      console.error("Failed to fetch enquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `${API}/site-settings/contact-enquiries/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchEnquiries();
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const deleteEnquiry = async (id) => {
    if (!window.confirm("Delete this enquiry?")) return;

    try {
      await axios.delete(`${API}/site-settings/contact-enquiries/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchEnquiries();
    } catch (error) {
      alert("Failed to delete enquiry");
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
    "Subject",
    "Message",
    "Status",
    "Created At",
  ];

  const rows = enquiries.map((item) => [
    item.name || "",
    item.email || "",
    item.phone || "",
    item.subject || "",
    (item.message || "").replace(/\n/g, " "),
    item.status || "",
    item.createdAt
      ? new Date(item.createdAt).toLocaleString()
      : "",
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "contact-enquiries.csv");

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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
  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-[#07111a]">
        Contact Enquiries
      </h1>

      <p className="mt-2 text-sm md:text-base text-slate-600">
        Manage all enquiries received from the contact page here.
      </p>
    </div>

    <button
      onClick={exportCSV}
      type="button"
      className="inline-flex h-11 items-center justify-center rounded-xl bg-[#167a7a] px-5 text-sm font-semibold text-white transition hover:opacity-90"
    >
      Export CSV
    </button>
  </div>
</div>

        <div className="p-5 md:p-6">
          {enquiries.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-slate-500">
              No enquiries found.
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
                      <th className="px-4 py-4 font-semibold text-[#07111a]">Subject</th>
                      <th className="px-4 py-4 font-semibold text-[#07111a]">Message</th>
                      <th className="px-4 py-4 font-semibold text-[#07111a]">Status</th>
                      <th className="px-4 py-4 font-semibold text-[#07111a]">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200 bg-white">
                    {enquiries.map((item) => (
                      <tr key={item._id} className="align-top">
                        <td className="px-4 py-4 text-slate-700">{item.name}</td>
                        <td className="px-4 py-4 text-slate-700">{item.email}</td>
                        <td className="px-4 py-4 text-slate-700">{item.phone}</td>
                        <td className="px-4 py-4 text-slate-700">{item.subject}</td>
                        <td className="max-w-[280px] whitespace-pre-wrap px-4 py-4 text-slate-700">
                          {item.message}
                        </td>
                        <td className="px-4 py-4">
                          <select
                            value={item.status}
                            onChange={(e) => updateStatus(item._id, e.target.value)}
                            className="h-11 min-w-[140px] rounded-xl border border-slate-300 bg-white px-3 text-sm text-[#07111a] outline-none transition focus:border-[#167a7a] focus:ring-2 focus:ring-[#167a7a]/10"
                          >
                            <option value="new">new</option>
                            <option value="contacted">contacted</option>
                            <option value="closed">closed</option>
                          </select>
                        </td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => deleteEnquiry(item._id)}
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

export default ContactEnquiries;