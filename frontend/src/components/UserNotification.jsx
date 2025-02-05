import { useState , useEffect } from "react";
import AppLoader from "./App-Loader";
import { MdDelete } from "react-icons/md";


const UserNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLaoding] = useState(true);
  const token = sessionStorage.getItem("token");

  const fetchData = async (endpoint, options) => {
    const defaultHeaders = {
      Authorization: `Bearer ${token}`,
    };

    if (!(options.body instanceof FormData)) {
      defaultHeaders["Content-Type"] = "application/json";
    }

    try {
      const response = await fetch(`/api${endpoint}`, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetchData(`/user/notification`, {
          method: "GET",
        });
        console.log(response);
        setLaoding(false);
        setNotifications(response || []);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [token]);

  const handleDeleteNotification = async (id) => {
    const queryParameter = new URLSearchParams({ notId : id}).toString();
      try {
        const response = await fetchData(`/user/delete/notification?${queryParameter}`, {
          method: "GET",
        });
        if(response){
          toast.success('Team deleted!!!');
        }
      } catch (err) {
        toast.error('Error in Deletion of Team Request');
      }
    };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <AppLoader />
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-lg">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="bg-white shadow-xl border border-gray-300 rounded-sm px-3 transform transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between gap-1">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-300" />
                    <h3 className="text-gray-900 font-medium line-clamp-1">
                      {notification.title}
                    </h3>
                  </div>
                  {notification.description && (
                    <p className="mt-1 text-gray-600 text-sm line-clamp-2 ml-5">
                      {notification.description}
                    </p>
                  )}
                </div>
                <button
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  title="Delete notification"
                  onClick={() => handleDeleteNotification(notification.id)}
                >
                  <MdDelete className="w-5 h-5" />
                </button>
              </div>
              {/*<div className="mt-2 ml-5">
                 <span className="text-xs text-gray-500">
                  {new Date(notification.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span> 
              </div>*/}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserNotification;