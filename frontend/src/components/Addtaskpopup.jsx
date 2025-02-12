import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer , toast } from "react-toastify";
import 'react-toastify/ReactToastify.css'

const AddTaskPopup = ({ onClose, onTaskAdded }) => {
  const location = useLocation();
   const { teamId } = location.state;

  const token = sessionStorage.getItem("token");

  const fetchData = async (endpoint, options) => {
    const defaultHeaders = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    try {
      const response = await fetch(`/api${endpoint}`, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  };

  const [taskDetails, setTaskDetails] = useState({
    title: "",
    description: "",
    startAt: new Date().toISOString().slice(0, -1), 
    endAt: "",
  });


  const handleAddTask = async () => {

    const payload = { ...taskDetails};

    try {
      const response = await fetchData(`/team/addTaskInTeam/${teamId}`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      onTaskAdded(response);
      console.log('here')
      onClose();
    
    } catch (error) {
      toast.error("Failed to add task.Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-[30%]">
        <div className="flex items-center justify-center">
              <h1 className="text-2xl font-semibold text-gray-800">
                Add Task 
              </h1>
        </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1">Title</label>
            <input
              type="text"
              value={taskDetails.title}
              onChange={(e) =>
                setTaskDetails({ ...taskDetails, title: e.target.value })
              }
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1">Description</label>
            <textarea
              value={taskDetails.description}
              onChange={(e) =>
                setTaskDetails({ ...taskDetails, description: e.target.value })
              }
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1">Start At</label>
            <input
              type="datetime-local"
              value={taskDetails.startAt}
              onChange={(e) =>
                setTaskDetails({ ...taskDetails, startAt: e.target.value })
              }
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1">End At</label>
            <input
              type="datetime-local"
              value={taskDetails.endAt}
              onChange={(e) =>
                setTaskDetails({ ...taskDetails, endAt: e.target.value })
              }
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              onClick={() => onClose()}
            >
              Cancel
            </button>
            <button
              className={ `${ taskDetails.title && taskDetails.description && taskDetails.startAt && taskDetails.endAt ?
                "bg-green-500" :  "bg-gray-300"
              }
              text-white px-4 py-2 rounded-lg `}
              onClick={handleAddTask}
              disabled={!taskDetails.title ||  !taskDetails.description || !taskDetails.startAt || !taskDetails.endAt}
            >
              Add Task
            </button>
          </div>
        </div>
        <ToastContainer position="top-right" autoClose={1000}/>
      </div>
  );
};

export default AddTaskPopup;
