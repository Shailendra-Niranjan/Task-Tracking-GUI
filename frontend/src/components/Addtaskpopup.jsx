import React, { useState, useEffect } from "react";

const Addtaskpopup = ({ setShowModal,onTaskAdded}) => {
  const [taskDetails, setTaskDetails] = useState({
    title: "",
    description: "",
    startAt: new Date().toISOString(),
    endAt: "",
  });

  const token = sessionStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!taskDetails.title.trim() || !taskDetails.description.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/user/addTask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskDetails),
      });

      const data = await response.json();
      if (response.ok) {
        setShowModal(false);
        onTaskAdded;
        
      } else {
        setError(data.message || "Failed to add task.");
      }
    } catch (error) {
      setError("An error occurred while adding the task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[30%]">
        <h2 className="text-xl font-bold mb-4 text-black">Add Task</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block font-semibold mb-1 text-black">Title</label>
          <input
            type="text"
            value={taskDetails.title}
            onChange={(e) =>
              setTaskDetails({ ...taskDetails, title: e.target.value })
            }
            className="w-full border border-black rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1 text-black">Description</label>
          <textarea
            value={taskDetails.description}
            onChange={(e) =>
              setTaskDetails({ ...taskDetails, description: e.target.value })
            }
            className="w-full border border-black rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <div className="flex justify-end gap-4">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>
          <button
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : "Add Task"}
          </button>
        </div>
      </div>
    </div>
  );
};


export default Addtaskpopup;
