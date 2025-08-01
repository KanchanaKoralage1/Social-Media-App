import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to view notifications");
        navigate("/login");
        return;
      }

      try {
        const res = await fetch("http://localhost:8080/api/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          console.error(
            "Failed to fetch notifications:",
            res.status,
            res.statusText
          );
          setError("Failed to load notifications");
          return;
        }
        const data = await res.json();
        console.log("Notifications API response:", data);
        setNotifications(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError("An error occurred while loading notifications");
      }
    };

    fetchNotifications();
  }, [navigate]);

  const handleNotificationClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  if (error) {
    return (
      <div className="text-center mt-10 text-red-500">
        {error}
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      {notifications.length === 0 ? (
        <div className="text-gray-500">No notifications yet.</div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded shadow cursor-pointer hover:bg-gray-100 ${
                notification.isRead ? "bg-gray-50" : "bg-white"
              }`}
              onClick={() => handleNotificationClick(notification.postId)}
            >
              <div className="flex items-center">
                <img
                  src={
                    notification.actorProfileImage
                      ? notification.actorProfileImage.startsWith("http")
                        ? notification.actorProfileImage
                        : `http://localhost:8080/uploads/${notification.actorProfileImage}`
                      : "/default-profile.png"
                  }
                  alt="Actor Profile"
                  className="w-10 h-10 rounded-full object-cover mr-4"
                />
                <div>
                  <p className="text-gray-800">
                    <span className="font-semibold">
                      {notification.actorFullName || notification.actorUsername}
                    </span>{" "}
                    {notification.message}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notification;
