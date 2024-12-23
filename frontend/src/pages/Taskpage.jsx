import React, { useState } from "react";
import NavBarForAuth from "../components/NavBarForAuth";
import { IoMdAdd } from "react-icons/io";
import Taskmenu from "../components/Taskmenu";

const Taskpage = () => {
  const [showModal, setShowModal] = useState(false);

  const token = sessionStorage.getItem("token");
   


  const [taskDetails, setTaskDetails] = useState({
    title: "",
    description: "",
    startAt: new Date().toISOString(), // Current date and time in ISO format with 'Z'
    endAt: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAddTask = async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("https://task-racker.onrender.com/user/addTask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskDetails),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Task added successfully!");
      } else {
        setMessage(data.message || "Failed to add task.");
      }
    } catch (error) {
      setMessage("An error occurred while adding the task.");
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  return (
    <>
      <NavBarForAuth />
      {token ? (
        <>
          <div className="text-2xl bg-white border-2 border-black text-center mt-3 p-2 rounded-md w-[20%] mx-auto">
            MY Task Dashboard
          </div>

         
          <div className="text-2xl bg-white text-right mt-3 p-2 rounded-md mx-12">
            <button
              type="button"
              className="bg-green-300 text-black rounded-lg px-6 py-2 border-2 border-black"
              onClick={() => setShowModal(true)}
            >
              <IoMdAdd />
            </button>
          </div>

          {/* Modal for Adding Task */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-lg w-[30%] max-w-screen-sm">
                <h2 className="text-xl font-semibold mb-4">Add Task</h2>
                <div className="mb-4">
                  <label className="block font-semibold mb-1">Title</label>
                  <input
                    type="text"
                    value={taskDetails.title}
                    onChange={(e) => setTaskDetails({ ...taskDetails, title: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-4 py-2"
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-semibold mb-1">Description</label>
                  <textarea
                    value={taskDetails.description}
                    onChange={(e) => setTaskDetails({ ...taskDetails, description: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-4 py-2"
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-semibold mb-1">Start At</label>
                  <input
                    type="datetime-local"
                    value={taskDetails.startAt.slice(0, -1)} // Removing 'Z' for datetime-local
                    onChange={(e) => setTaskDetails({ ...taskDetails, startAt: new Date(e.target.value).toISOString() })}
                    className="w-full border border-gray-300 rounded-md px-4 py-2"
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-semibold mb-1">End At</label>
                  <input
                    type="datetime-local"
                    value={taskDetails.endAt.slice(0, -1)} // Removing 'Z' for datetime-local
                    onChange={(e) => setTaskDetails({ ...taskDetails, endAt: new Date(e.target.value).toISOString() })}
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
                    {loading ? "Adding..." : "Add Task"}
                  </button>
                </div>
              </div>
            </div>
          )}
         
            <Taskmenu/>
          
          {message && (
            <div className="text-center mt-4 text-lg font-semibold text-blue-600">
              {message}
            </div>
          )}
        </>
      ) : (
        <div>Login Required</div>
      )}
    </>
  );
};

export default Taskpage;