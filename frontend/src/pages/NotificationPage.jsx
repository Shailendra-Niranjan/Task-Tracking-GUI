import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "../components/NavBar";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`user/notification/teamrequest`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("API Response:", response.data);
        
        setNotifications(response.data.notifications || []);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
  
    fetchNotifications();
  }, [token]);

  const handleAccept = (id) => {
    
    console.log(`Accepted notification ID: ${id}`);
  };

  const handleReject = (id) => {
    
    console.log(`Rejected notification ID: ${id}`);
  };

  return (
    <>
    <NavBar/>
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      {Array.isArray(notifications) && notifications.length > 0 ? (
        notifications.map((notification) => (
          <div
            key={notification.id}
            className="bg-white shadow-md rounded-lg p-4 mb-4 flex justify-between items-center"
          >
            <p>{notification.message}</p>
            <div className="flex gap-4">
              <button
                onClick={() => handleAccept(notification.id)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                Accept
              </button>
              <button
                onClick={() => handleReject(notification.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Reject
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No notifications available.</p>
      )}
    </div>
    </>
  );
};

export default Notifications;
