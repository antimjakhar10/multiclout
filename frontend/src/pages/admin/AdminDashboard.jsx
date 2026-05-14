import { useEffect, useState } from "react";
import {
  BookOpen,
  Users,
  MessageSquareQuote,
  CircleHelp,
  BadgeCheck,
  PlaySquare,
  Video,
} from "lucide-react";
import StatCard from "../../components/admin/StatCard";
import { API, getAuthHeaders } from "../../utils/api";

function AdminDashboard() {
  const [summary, setSummary] = useState({
    totalCourses: 0,
    totalMentors: 0,
    totalTestimonials: 0,
    totalFaqs: 0,
    totalReasons: 0,
    totalTutorials: 0,
    totalVideos: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API}/admin/dashboard/summary`, {
        method: "GET",
        headers: getAuthHeaders ? getAuthHeaders() : {},
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Dashboard summary API error:", data);
        return;
      }

      const payload = data?.data || data || {};

      setSummary({
        totalCourses: Number(payload.totalCourses || 0),
        totalMentors: Number(payload.totalMentors || 0),
        totalTestimonials: Number(payload.totalTestimonials || 0),
        totalFaqs: Number(payload.totalFaqs || 0),
        totalReasons: Number(payload.totalReasons || 0),
        totalTutorials: Number(payload.totalTutorials || 0),
        totalVideos: Number(payload.totalVideos || 0),
      });
    } catch (error) {
      console.error("Dashboard summary error:", error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    { title: "Courses", value: summary.totalCourses, icon: BookOpen },
    { title: "Tutorials", value: summary.totalTutorials, icon: PlaySquare },
    { title: "Mentors", value: summary.totalMentors, icon: Users },
    {
      title: "Testimonials",
      value: summary.totalTestimonials,
      icon: MessageSquareQuote,
    },
    { title: "FAQs", value: summary.totalFaqs, icon: CircleHelp },
    { title: "Reasons", value: summary.totalReasons, icon: BadgeCheck },
    { title: "Videos", value: summary.totalVideos, icon: Video },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] bg-gradient-to-r from-slate-900 via-cyan-900 to-teal-800 p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold">Welcome to Multiclout Admin</h2>
        <p className="mt-2 text-sm text-white/75">
          Manage all website content from one professional dashboard.
        </p>
      </div>

      {loading ? (
        <div className="rounded-3xl bg-white p-6 text-slate-600 shadow-sm">
          Loading dashboard...
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <StatCard
              key={card.title}
              title={card.title}
              value={card.value}
              icon={card.icon}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;