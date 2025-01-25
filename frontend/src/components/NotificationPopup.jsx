import React from "react";
import { useNavigate } from "react-router-dom";

const NotificationPopup = () => {
  const navigate = useNavigate();

  const handleViewNotifications = () => {
    navigate("/notifications");
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-64 bg-white shadow-lg rounded-lg z-50">
      <div className="p-4">
        <p className="text-gray-700 font-medium">You have new notifications!</p>
        <button
          onClick={handleViewNotifications}
          className="mt-2 text-sm text-blue-500 hover:underline"
        >
          View All Notifications
        </button>
      </div>
    </div>
  );
};

export default NotificationPopup;
