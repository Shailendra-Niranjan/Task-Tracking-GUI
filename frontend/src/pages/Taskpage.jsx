import React, { useState } from "react";
import NavBarForAuth from "../components/NavBarForAuth";
import { IoMdAdd } from "react-icons/io";
import Addtaskpopup from "../components/Addtaskpopup";

const Taskpage = () => {
  const [showModal, setShowModal] = useState(false);
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

      <div className="text-2xl bg-white border-2 border-black text-center mt-3 p-2 rounded-md w-[20%] mx-auto">
        MY Task Dashboard
      </div>

      {/* Add Task Button */}
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
      {showModal && <Addtaskpopup />}

      {/* Message Section */}
      {message && (
        <div className="text-center mt-4 text-lg font-semibold text-blue-600">
          {message}
        </div>
      )}
    </>
  );
};

export default Taskpage;
