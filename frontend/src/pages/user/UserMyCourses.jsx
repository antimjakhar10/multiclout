import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlayCircle, ShoppingBag } from "lucide-react";
import { API } from "../../utils/api";
import { getImageUrl } from "../../utils/videoHelpers";

function UserMyCourses() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token =
          localStorage.getItem("userToken") || localStorage.getItem("token");

        const res = await fetch(`${API}/orders/my-orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok && data.success) {
          setOrders(data.orders || []);
        }
      } catch (error) {
        console.error("Orders fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const courses = orders.flatMap((order) =>
    (order.items || []).map((item) => ({
      ...item,
      orderDate: order.createdAt,
      orderId: order._id,
    })),
  );

  if (loading) {
    return <div className="text-white/70">Loading your courses...</div>;
  }

  return (
    <div className="space-y-5">
      <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300">
          Purchased Courses
        </p>
        <h2 className="mt-2 text-3xl font-bold text-white">My Courses</h2>
        <p className="mt-2 text-sm text-white/55">
          Courses will appear here after a successful payment.
        </p>
      </div>

      {courses.length === 0 ? (
        <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-10 text-center">
          <ShoppingBag className="mx-auto text-cyan-300" size={42} />
          <h3 className="mt-4 text-xl font-bold text-white">
            No courses purchased yet
          </h3>
          <button
            onClick={() => navigate("/")}
            className="mt-5 rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-white"
          >
            Explore Courses
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((item, idx) => {
            const course = item.course || {};
            const slug = course.slug;

            return (
              <div
                key={`${item.orderId}-${idx}`}
                className="overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.04]"
              >
                <img
                  src={getImageUrl(
                    course?.image || item?.course?.image || item?.image,
                  )}
                  alt={item.title}
                  className="h-44 w-full object-cover"
                />

                <div className="p-5">
                  <h3 className="line-clamp-2 text-lg font-bold text-white">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm text-white/55">
                    By {item.instructor || "Expert Instructor"}
                  </p>

                  <p className="mt-3 text-sm font-semibold text-cyan-300">
                    ₹{Number(item.price || 0).toLocaleString()}
                  </p>

                  <button
                    onClick={() =>
                      slug
                        ? navigate(`/courses/${slug}`)
                        : navigate("/watch-videos")
                    }
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-4 py-3 text-sm font-semibold text-white"
                  >
                    <PlayCircle size={17} />
                    Start Learning
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default UserMyCourses;
