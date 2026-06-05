import { useEffect, useState } from "react";
import { Bell, Trash2  } from "lucide-react";
import { API } from "../../utils/videoHelpers";

function UserNotifications() {
  const [videos, setVideos] = useState([]);

  const token =
    localStorage.getItem("userToken") ||
    localStorage.getItem("token");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(
        `${API}/videos/user/notifications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        const validNotifications = (
          data.notifications || []
        ).filter(
          (item) =>
            item.adminActionType &&
            item.adminActionReason
        );

        setVideos(validNotifications);

        await fetch(
          `${API}/videos/user/notifications/read`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        window.dispatchEvent(
          new Event("notificationsUpdated")
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteNotification = async (id) => {
  try {
    const res = await fetch(
      `${API}/videos/user/notifications/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (data.success) {
      setVideos((prev) =>
        prev.filter((item) => item._id !== id)
      );

      window.dispatchEvent(
        new Event("notificationsUpdated")
      );
    }
  } catch (error) {
    console.error(error);
  }
};

  return (
    <div className="space-y-5">
      <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
        <div className="flex items-center gap-3">
          <Bell className="text-cyan-300" />

          <div>
            <h2 className="text-2xl font-bold text-white">
              Notifications
            </h2>

            <p className="text-sm text-white/55">
              Video approval and rejection updates
            </p>
          </div>
        </div>
      </div>

      {videos.length === 0 ? (
        <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-8 text-center text-white/55">
          No notifications found.
        </div>
      ) : (
        <div className="space-y-4">
          {videos.map((item) => (
            <div
              key={item._id}
              className={`rounded-[24px] p-5 border ${
                item.adminActionType === "deleted"
                  ? "border-red-500/20 bg-red-500/10"
                  : item.adminActionType === "approved"
                  ? "border-emerald-500/20 bg-emerald-500/10"
                  : "border-yellow-500/20 bg-yellow-500/10"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg font-semibold text-white">
                    {item.title}
                  </h3>

                  <p
                    className={`mt-2 text-sm ${
                      item.adminActionType === "deleted"
                        ? "text-red-200"
                        : item.adminActionType === "approved"
                        ? "text-emerald-200"
                        : "text-yellow-200"
                    }`}
                  >
                    {item.adminActionReason}
                  </p>

                  <p className="mt-3 text-xs text-white/45">
                    {item.adminActionAt
                      ? new Date(
                          item.adminActionAt
                        ).toLocaleString("en-IN")
                      : "Recently"}
                  </p>
                  <button
  onClick={() => deleteNotification(item._id)}
  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-red-500 hover:text-white"
>
  <Trash2 size={15} />
</button>
                </div>

                <div
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase ${
                    item.adminActionType === "deleted"
                      ? "bg-red-500/20 text-red-200"
                      : item.adminActionType === "approved"
                      ? "bg-emerald-500/20 text-emerald-200"
                      : "bg-yellow-500/20 text-yellow-200"
                  }`}
                >
                  {item.adminActionType}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserNotifications;