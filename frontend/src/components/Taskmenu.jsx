import React, { useEffect, useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { Link } from "react-router-dom";
import Addtaskpopup from "./Addtaskpopup";
import EditTaskPopup from "./EditTaskPopup";
import classNames from "classnames"; 
import { Progress } from "antd";
import Apploader from './App-Loader';
import '../../src/index.css';

const Taskmenu = () => {
  const token = sessionStorage.getItem("token");

  const [taskItems, setTaskItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [totalTaskCount,setTotalTaskCount] = useState(0);
  const [totalCompletedTaskCount,setTotalCompletedTaskCount] = useState(0);

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
      setTotalTaskCount(data.length)
      const updatedTasks = updateTaskColor(data);
      setTaskItems(updatedTasks);

    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const refreshTasks = () => fetchTasks();

  const handleDelete = async (id) => {
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("uuid", id); 
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
      } else {
        const data = await response.json(); 
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (task) => {
    setTaskToEdit(task);
    setShowEditModal(true);
  };

  const updateTaskColor = (tasks) => {
    let completedTasksCount = 0; // Track completed tasks
  
    const updatedTasks = tasks.map((task) => {

      if (task.subTaskList && task.subTaskList.length > 0) {
        const completedCount = task.subTaskList.filter(
          (subTask) => subTask.status === "COMPLETED"
        ).length;
        const totalSubTasks = task.subTaskList.length;
  
        if (completedCount === totalSubTasks) {
          completedTasksCount++; 
        }
        return {
          ...task,
          completedCount, // Number of completed subtasks
          totalSubTasks, // Total subtasks
          color: completedCount === totalSubTasks ? "green" : "gray",
        };
      } else {
        return {
          ...task,
          completedCount: 0,
          totalSubTasks: 0,
          color: "blue",
        };
      }
    });
  
    
    setTotalCompletedTaskCount(completedTasksCount);
    
    return updatedTasks;
  };
  

  return (
    <div className="w-[60%] mx-auto mt-8 p-6 bg-white rounded-2xl shadow-2xl border-2 border-black flex flex-col space-y-6">
  {/* Title */}
  

  {/* Loading State */}
  {loading ? (
    <div className="flex justify-center">
      <Apploader />
    </div>
  ) : taskItems.length === 0 ? (
    <p className="text-gray-500 text-center">No tasks available. Add a new task to get started!</p>
  ) : (
    <div className="flex gap-6">
      {/* Progress Circle */}
      <div className="flex justify-center items-center">
        <Progress
          type="circle"
          percent={(totalCompletedTaskCount / totalTaskCount) * 100}
          size={200}
          strokeColor="#2563eb"
          status="active"
          format={() => `${totalCompletedTaskCount}/${totalTaskCount}`}
        />
      </div>

      {/* Scrollable Task List */}
      <div className="w-full max-h-[300px] overflow-y-auto space-y-4 pr-2">
        {taskItems.map((task) => (
          <div
            key={task.id}
            className={classNames(
              "flex items-center justify-between p-4 rounded-lg shadow-md transition duration-300 hover:shadow-lg",
              {
                "bg-green-200": task.color === "green",
                "bg-gray-200": task.color === "gray",
                "bg-blue-200": task.color === "blue",
              }
            )}
          >
            <Link to={`/subtasks/${task.title}/${task.id}/${null}`} className="text-lg font-semibold text-black hover:underline">
              {task.title}
            </Link>
            <div className="flex gap-3">
              <button className="text-blue-600 hover:text-blue-800 transition" onClick={() => handleEdit(task)}>
                <MdEdit size={24} />
              </button>
              <button className="text-red-600 hover:text-red-800 transition" onClick={() => handleDelete(task.id)}>
                <MdDelete size={24} />
              </button>
              

            </div>
          </div>
        ))}
      </div>
    </div>
  )}

  {/* Task Modals */}
  {showAddModal && <Addtaskpopup setShowModal={setShowAddModal} onTaskAdded={refreshTasks} />}
  {showEditModal && taskToEdit && <EditTaskPopup setShowModal={setShowEditModal} taskToEdit={taskToEdit} onTaskUpdated={refreshTasks} />}
</div>
  );
};

export default Taskmenu;
