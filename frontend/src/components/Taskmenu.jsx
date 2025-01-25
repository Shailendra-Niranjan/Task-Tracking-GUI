import React, { useEffect, useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { Link } from "react-router-dom";
import Addtaskpopup from "./Addtaskpopup"; // Import the Addtaskpopup component
import EditTaskPopup from "./EditTaskPopup";

const Taskmenu = () => {
  const token = sessionStorage.getItem("token");
  const [taskItems, setTaskItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/user/getAllTask`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setTaskItems(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;
  
    setLoading(true);
    try {
      
      const formData = new FormData();
      formData.append("uuid", id); 
       
      console.log(formData)
      
      const queryParams = new URLSearchParams(formData).toString();
  
     
      const response = await fetch(`/api/user/delete/task?${queryParams}`, {
        method: "GET",  
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        
        const updatedList = taskItems.filter((task) => task.id !== id);
        setTaskItems(updatedList);
        alert("Task deleted successfully!");
      } else {
        const data = await response.json();
        alert(data.message || "Failed to delete task.");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("An error occurred while deleting the task.");
    } finally {
      setLoading(false);
    }
  };


  const handleEdit = (task) => {
    setTaskToEdit(task);
    setShowEditModal(true);
  };

  const refreshTasks = () => fetchTasks();

  return (
    <div className="w-[60%] mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg border-2 border-black">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-black">Your Tasks</h2>
       
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : taskItems.length === 0 ? (
        <p>No tasks available. Add a new task to get started!</p>
      ) : (
        <div className="space-y-4">
          {taskItems.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between border-b pb-4"
            >
              <Link
                to={`/subtasks/${task.name}/${task.description}`}
                className="text-black hover:underline text-lg"
              >
                {task.title}
              </Link>
              <div className="flex gap-4">
                <button
                  className="text-blue-500 hover:text-blue-700"
                  onClick={() => handleEdit(task)}
                >
                  <MdEdit size={24} />
                </button>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(task.id)}
                >
                  <MdDelete size={24} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <Addtaskpopup
          setShowModal={setShowAddModal}
          onTaskAdded={refreshTasks}
        />
      )}
      {showEditModal && taskToEdit && (
        <EditTaskPopup
          setShowModal={setShowEditModal}
          taskToEdit={taskToEdit}
          onTaskUpdated={refreshTasks}
        />
      )}
    </div>
  );
};

export default Taskmenu;
