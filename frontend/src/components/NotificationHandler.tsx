import { useEffect } from "react";
import { useSocket } from "@/context/SocketContext";
import { toast } from "sonner";
import { Bell } from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";

const NotificationHandler = () => {
  const { socket } = useSocket();
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (!socket) return;

    const handleEventCreated = (data: { message: string; event: any }) => {
      toast(data.message, {
        description: `Happening on ${new Date(data.event.date).toLocaleDateString()}`,
        icon: <Bell className="h-4 w-4 text-emerald-500" />,
      });
      addNotification({
        title: data.message,
        description: `New event scheduled on ${new Date(data.event.date).toLocaleDateString()}`,
        actionPath: "/events",
      });
    };

    const handleEventUpdated = (data: { message: string; event: any }) => {
      toast(data.message, {
        description: "Details have been updated.",
        icon: <Bell className="h-4 w-4 text-blue-500" />,
      });
      addNotification({
        title: data.message,
        description: "Event details have been updated.",
        actionPath: "/events",
      });
    };

    const handleClubCreated = (data: { message: string; club: any }) => {
      toast(data.message, {
        description: `Category: ${data.club.category} | Coordinator: ${data.club.coordinator}`,
        icon: <Bell className="h-4 w-4 text-indigo-500" />,
      });
      addNotification({
        title: data.message,
        description: `New club in category: ${data.club.category}`,
        actionPath: "/clubs",
      });
    };

    const handleAdminAnnouncement = (data: { title: string; message: string }) => {
      toast(data.title, {
        description: data.message,
        icon: <Bell className="h-4 w-4 text-purple-500 animate-bounce" />,
        style: {
          border: '1px solid rgba(168, 85, 247, 0.4)',
          background: 'rgba(24, 24, 27, 0.95)',
        }
      });
      addNotification({
        title: data.title,
        description: data.message,
      });
    };

    socket.on("eventCreated", handleEventCreated);
    socket.on("eventUpdated", handleEventUpdated);
    socket.on("clubCreated", handleClubCreated);
    socket.on("adminAnnouncement", handleAdminAnnouncement);

    return () => {
      socket.off("eventCreated", handleEventCreated);
      socket.off("eventUpdated", handleEventUpdated);
      socket.off("clubCreated", handleClubCreated);
      socket.off("adminAnnouncement", handleAdminAnnouncement);
    };
  }, [socket, addNotification]);

  return null;
};

export default NotificationHandler;
