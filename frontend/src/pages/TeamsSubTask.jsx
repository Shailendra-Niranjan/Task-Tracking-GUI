import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { IoMdAdd } from "react-icons/io";
import { MdDelete, MdEdit } from "react-icons/md";
import AddSubTaskPopup from "../components/AddSubTaskPopup";
import '../../src/index.css';
import { useLocation, useParams } from "react-router-dom";
import AppLoader from "../components/App-Loader";
import { HiDotsVertical } from "react-icons/hi";

const TeamsSubTask = () => {
  const token = sessionStorage.getItem("token");
  const location = useLocation();
  const TASK = location.state || {}; 
   

  const [task, setTask] = useState(TASK);
  const [id, setId] = useState(TASK?.id || null);
  const [subtasks, setSubtasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSubTaskPopup, setShowSubTaskPopup] = useState(false);

  useEffect(() => {
    if (TASK && TASK.id) {
      setTask(TASK);
      setId(TASK.id);
    }
  }, [TASK]);

  const fetchData = async (endpoint, options = {}) => {
    const headers = {
      Authorization: `Bearer ${token}`,
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
    };

    try {
      const response = await fetch(`/api${endpoint}`, { ...options, headers });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  };

  const fetchSubtasks = async () => {
    if (!id) return;

    try {
      const queryParams = new URLSearchParams({ taskId: id }).toString();
      const data = await fetchData(`/user/getAllSubTask?${queryParams}`);

      if (data?.data && Array.isArray(data.data)) {
        console.log(data.data);
        setSubtasks(data.data);
      } else {
        setSubtasks([]);
      }
    } catch (error) {
      console.error("Error fetching subtasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchSubtasks();
    }
  }, [id]);

  const handleDelete = async (subtaskId) => {
    try {
      await fetchData(`/user/deleteSubTask/${subtaskId}`, { method: "GET" });
      setSubtasks((prevSubtasks) => prevSubtasks.filter(subtask => subtask.id !== subtaskId));
    } catch (error) {
      console.error("Error deleting subtask:", error);
    }
  };

  const handleEdit = (subtaskId, title, description) => {
    console.log(`Editing subtask: ${subtaskId}, ${title}, ${description}`);
    // Implement edit logic
  };

  const handleStatusChange = async (subtaskId, newStatus) => {
    try {
      await fetchData(`/user/updateSubTask/${subtaskId}`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });

      setSubtasks((prevSubtasks) =>
        prevSubtasks.map((subtask) =>
          subtask.id === subtaskId ? { ...subtask, status: newStatus } : subtask
        )
      );
    } catch (error) {
      console.error("Error updating subtask status:", error);
    }
  };

  const taskStatusOptions = [
    { value: "PENDING", label: "Pending" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "COMPLETED", label: "Completed" }
  ];

  return (
    <>
      <NavBar />

      <div className="mt-5">
      <div className="flex items-center justify-center">
            <div className="bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 rounded-xl shadow-sm border border-gray-200 px-8 py-4">
              <h1 className="text-2xl font-semibold text-gray-800">
               Team Subtask 
              </h1>
            </div>
        </div>

        <div className="flex justify-end items-center mt-3 mx-6">
          <button 
            type="button" 
            className="bg-green-300 text-black rounded-lg px-2 py-2 border-2 border-black"
            onClick={() => setShowSubTaskPopup(true)}
          >
            <IoMdAdd className="inline-block text-xl text-red" />
          </button>
        </div>
      </div>

      <div className="w-full flex items-center justify-center bg-white p-4 mx-2 mt-1 h-auto shadow-md border-2">
        <div className="w-1/2 p-4">
          <div className="w-full max-h-[300px] overflow-y-auto space-y-5">
            { loading ? (
              <div className="justify-center mx-auto"><AppLoader /></div>
            ) : (
              subtasks.map((subtask) => (
                <div
                  key={subtask.id}
                  className={`flex items-center justify-between gap-4 mt-2 border-2 border-black ${
                    subtask.status === "COMPLETED" ? "bg-green-300" : "bg-white"
                  } p-4 rounded-lg shadow-md`}
                >
                  <div className="w-full text-center sm:w-3/4">
                    <p
                      className={`text-lg font-bold ${
                        subtask.status === "COMPLETED" ? "text-green-800" : "text-black"
                      }`}
                    >
                      {subtask.title}
                    </p>
                  </div>
                  <div className="flex gap-2">
                  <select
                      value={subtask.status}
                      onChange={(e) => handleStatusChange(subtask.id, e.target.value)}
                      className="border border-black p-1 rounded-sm"
                    >
                      {taskStatusOptions.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                    <button
                      className="border border-black rounded-sm text-2xl p-1"
                      onClick={() => handleDelete(subtask.id)}
                    >
                      <MdDelete />
                    </button>
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => handleEdit(subtask.id, subtask.title, subtask.description)}
                    >
                      <MdEdit size={24} />
                    </button>
                     <button 
                     className="text-yellow-500 hover:text-yellow-800 transition" 
                      >
                      <HiDotsVertical  size={24} />
                      </button>
                    
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {showSubTaskPopup &&  
        <AddSubTaskPopup 
          onTaskAdded={() => {
            setShowSubTaskPopup(false);
            fetchSubtasks(); // Refresh subtasks after adding
          }}
          taskTitle={task.title} 
          taskID={id} 

        /> 
      }
    </>
  );
};

export default TeamsSubTask;
