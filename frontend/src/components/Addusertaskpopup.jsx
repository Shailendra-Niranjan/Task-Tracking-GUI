import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Addusertaskpopup = ({ setShowModal }) => {
  const location = useLocation();
  const navigate = useNavigate();

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
    startAt: new Date().toISOString().slice(0, -1), // Remove 'Z' for datetime-local format
    endAt: "",
  });

 
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAddTask = async () => {
    setLoading(true);
    setError(null);

    const payload = { ...taskDetails };

    try {
      const response = await fetchData(`/user/addTask`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

    //   onTaskAdded(response);
      setShowModal(false);
    } catch (error) {
      setError("Failed to add task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    setShowModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-[30%]">
          <h2 className="text-xl font-semibold mb-4">Add Task</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}

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
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              onClick={handleAddTask}
              disabled={loading}
            >
              {loading ? "Saving..." : "Add Task"}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default Addusertaskpopup;
