import { useState , useEffect } from "react";
import AppLoader from "./App-Loader";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/ReactToastify.css'

const TeamRequest = () => {
  const [teamNotifications, setTeamNotifications] = useState([]);
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
        const response = await fetchData(`/user/notification/teamrequest`, {
          method: "GET",
        });
        console.log(response);
        setLaoding(false);
        setTeamNotifications(response || []);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, [token]);

  const handleTeamAcception = async (id) => {
    let formdata = new FormData();
    formdata.append('teamId', id);
    try {
      const response = await fetchData(`/team/acceptTeamCreationsReq`, {
        method: "POST",
        body: formdata,
      });
      if (response) {
        toast.success('Team Accepted!!!');
      }
    } catch (err) {
      toast.error('Error in acceptance of Team');
    }
  };

  const handleTeamRejection = async (id) => {
    
    try {
      const queryParameter = new URLSearchParams({ notId : id}).toString();
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
      <ToastContainer position="top-right" autoClose={3000} />
      
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <AppLoader />
        </div>
      ) : teamNotifications.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-lg">No team requests pending</p>
        </div>
      ) : (
        <div className="space-y-4">
          {teamNotifications.map((notification) => (
            <div
              key={notification.id}
              className="bg-white border border-gray-100 shadow-sm rounded-xl p-6 transform transition-all duration-200 hover:shadow-md"
            >
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                    <h3 className="text-lg font-medium text-gray-900">
                      {notification.title}
                    </h3>
                  </div>
                  <div className="ml-5">
                    <p className="text-gray-600">
                      Team Name: <span className="font-medium">{notification.teamName}</span>
                    </p>
                    {notification.description && (
                      <p className="text-sm text-gray-500 mt-1">
                        {notification.description}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-row sm:flex-col gap-3 ml-5 sm:ml-0">
                  <button
                    onClick={() => handleTeamAcception(notification.teamId)}
                    className="flex-1 sm:flex-none px-6 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors duration-200 font-medium"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleTeamRejection(notification.id)}
                    className="flex-1 sm:flex-none px-6 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200 font-medium"
                  >
                    Reject
                  </button>
                </div>
              </div>
              
              {/* <div className="mt-4 ml-5">
                <span className="text-xs text-gray-500">
                  {new Date(notification.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamRequest;