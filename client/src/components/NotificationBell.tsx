import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

const NotificationBell = ({ scrolled = false }: { scrolled?: boolean }) => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Har request pe fresh token padhta hai.
  // Agar aapke login ka key alag hai to yahan naam badal do.
  const getHeaders = () => {
    const token =
      localStorage.getItem("authToken") ?? localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  };

  const fetchCount = async () => {
    try {
      const res = await fetch(`${API}/notifications/unread-count`, {
        headers: getHeaders(),
      });
      if (res.ok) setCount((await res.json()).count);
    } catch {}
  };

  const fetchList = async () => {
    try {
      const res = await fetch(`${API}/notifications`, {
        headers: getHeaders(),
      });
      if (res.ok) setItems(await res.json());
    } catch {}
  };

  // Poll unread count every 30 seconds
  useEffect(() => {
    fetchCount();
    const id = setInterval(fetchCount, 30000);
    return () => clearInterval(id);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = () => {
    if (!open) fetchList();
    setOpen(!open);
  };

  const handleClick = async (n: NotificationItem) => {
    if (!n.isRead) {
      await fetch(`${API}/notifications/${n._id}/read`, {
        method: "PATCH",
        headers: getHeaders(),
      });
      fetchCount();
    }
    setOpen(false);
    if (n.link) navigate(n.link);
  };

  const markAll = async () => {
    await fetch(`${API}/notifications/read-all`, {
      method: "PATCH",
      headers: getHeaders(),
    });
    setItems(items.map((n) => ({ ...n, isRead: true })));
    setCount(0);
  };

  return (
    <div
      ref={ref}
      style={{ position: "relative", display: "flex", alignItems: "center" }}
    >
      <button
        onClick={toggle}
        aria-label="Notifications"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          lineHeight: 1,
          color: scrolled ? "rgba(0,0,0,0.55)" : "#fff",
        }}
      >
        <Bell size={22} style={{ display: "block" }} />
        {count > 0 && (
          <span
            style={{
              position: "absolute",
              top: -6,
              right: -6,
              background: "#dc2626",
              color: "#fff",
              borderRadius: "999px",
              fontSize: 11,
              minWidth: 18,
              height: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-3 w-80 max-w-[90vw] bg-white border border-black/10 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-black/10">
            <h3 className="text-sm font-semibold text-black tracking-wide">
              Notifications
            </h3>
            <button
              onClick={markAll}
              className="text-xs text-[#c9a96e] hover:text-black transition-colors cursor-pointer"
            >
              Mark all read
            </button>
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto">
            {items.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-2 py-10 text-black/45">
                <Bell size={26} strokeWidth={1.5} />
                <p className="text-sm">No notifications yet</p>
              </div>
            )}

            {items.map((n) => (
              <div
                key={n._id}
                onClick={() => handleClick(n)}
                className={`relative px-4 py-3 cursor-pointer border-b border-black/5 last:border-b-0 transition-colors hover:bg-[#c9a96e]/10 ${
                  n.isRead ? "bg-transparent" : "bg-[#c9a96e]/10"
                }`}
              >
                {!n.isRead && (
                  <span className="absolute left-1.5 top-1/2 -translate-y-1/2 size-1.5 rounded-full bg-[#c9a96e]" />
                )}
                <p
                  className={`text-sm text-black ${
                    n.isRead ? "font-normal" : "font-semibold"
                  }`}
                >
                  {n.title}
                </p>
                <p className="text-xs text-black/55 mt-0.5">{n.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
