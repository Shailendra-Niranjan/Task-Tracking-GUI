import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import { FaTasks } from "react-icons/fa";
import { BsChatSquareDots } from "react-icons/bs";
import Addtaskpopup from "../components/Addtaskpopup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import AppLoader from "../components/App-Loader";
import { HiDotsVertical, HiUserGroup } from "react-icons/hi";
import NavBar from "../components/NavBar";
import { MdDelete, MdEdit, MdOutlineAdminPanelSettings } from "react-icons/md";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { Progress } from "antd";
import EditTaskPopup from "../components/EditTaskPopup";
import AssignDessignTeamTask from "../components/AssignDessignTeamTask";
import ChatGroup from "./ChatGroup";

const Teamstask = () => {
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [teamsTask, setTeamTask] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [openAssign, setOpenAssign] = useState(false);
  const [showChatGroup, setShowChatGroup] = useState(false);
  const [totalTaskCount, setTotalTaskCount] = useState(0);
  const [totalCompletedTaskCount, setTotalCompletedTaskCount] = useState(0);
 

  const location = useLocation();
  const navigate = useNavigate();

  const { teamId,team } = location.state || {};
  
  const users = team.users || [];
  const admins = team.admins || [];
  const creator = team.creator || [];

  const [allUsers, setAllUsers] = useState({
    users: users,
    admins: admins,
    creator: creator,
  });
   
  console.log(team)



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

  useEffect(() => {
    const getAllTeamtask = async () => {
      try {
        const queryParams = new URLSearchParams({ teamId: teamId }).toString();
        const response = await fetchData(`/team/getAllTask?${queryParams}`, {
          method: "GET",
        });
        setLoading(false);

        
        setTeamTask(response);

        const data = updateTaskColor(response);
        setTotalTaskCount(response.length);
        setTeamTask(data);
      } catch (err) {
        toast.error("oops! error fetching task");
      }
    };

    getAllTeamtask();
  }, [teamId]);

  const handleDelete = async (id) => {
    setLoading(true);

    try {
      const formData = new FormData();
      if (teamId) {
        formData.append("teamId", teamId);
      }

      formData.append("uuid", id);
      const queryParams = new URLSearchParams(formData).toString();

      const response = await fetch(`/api/user/delete/task?${queryParams}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const updatedTasks = teamsTask.filter((task) => task.id !== id);
        setTeamTask(updatedTasks);
        toast.success("Task deleted successfully");
      } else {
        toast.error("Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Error deleting task");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (task) => {
    setTaskToEdit(task);
    setShowEditModal(true);
  };

  const refreshTasks = async () => {
    const queryParams = new URLSearchParams({ teamId: teamId }).toString();
    try {
      const response = await fetchData(`/team/getAllTask?${queryParams}`, {
        method: "GET",
      });
      const data = updateTaskColor(response);
      setTeamTask(data);
    } catch (err) {
      toast.error("Error refreshing tasks");
    }
  };

  const updateTaskColor = (tasks) => {
    let completedTasksCount = 0;

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
          completedCount,
          totalSubTasks,
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

  const handleThreeDots = () => {
    setOpenAssign(true);
  };

  const currentUser = JSON.parse(sessionStorage.getItem("user"));

  const handleChatGroupOpen = () => {
    setShowChatGroup(true);
  };

  return (
    <>
      <NavBar />
      {!showChatGroup ? (
        <>
          <div className="mt-5 shadow-2xl"></div>
          <div className="flex items-center justify-center">
            <div className="bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 rounded-xl shadow-sm border border-gray-200 px-8 py-4">
              <h1 className="text-2xl font-semibold text-gray-800">
                {team.teamName} tasks
              </h1>
            </div>
          </div>

          <div className="flex justify-end items-center mt-3 mx-6 gap-3">
            <button
              type="button"
              className="bg-black text-white rounded-lg px-4 py-2 flex items-center gap-2 border-2 border-black shadow-md hover:bg-white hover:text-black transition-all duration-300"
              onClick={() => setShowModal(true)}
            >
              <IoMdAdd className="inline-block text-xl" /> Add Task
            </button>

            <button
              type="button"
              className="bg-indigo-600 text-white rounded-lg px-4 py-2 flex items-center gap-2 border-2 border-indigo-600 shadow-md hover:bg-white hover:text-indigo-600 transition-all duration-300"
              onClick={handleChatGroupOpen}
            >
              <BsChatSquareDots className="inline-block text-xl" /> Team Chat
            </button>
          </div>

          <div className="w-[60%] mx-auto mt-8 p-6 bg-white rounded-2xl shadow-2xl border-2 border-black flex flex-col space-y-6">
            <div className="flex justify-around space-x-4 mt-4">
              <div className="flex flex-col items-center bg-gray-100 p-4 rounded-lg border border-gray-300 hover:shadow-md transition">
                <MdOutlineAdminPanelSettings className="text-3xl text-blue-500" />
                <p className="mt-2 text-lg font-semibold">Admins</p>
                <p className="text-sm text-black">
                  {team.admins?.length + 1 || 0} Admin(s)
                </p>
              </div>

              <div className="flex flex-col items-center bg-gray-100 p-4 rounded-lg border border-gray-300 hover:shadow-md transition">
                <HiUserGroup className="text-3xl text-green-500" />
                <p className="mt-2 text-lg font-semibold">Users</p>
                <p className="text-sm text-black">{team.users?.length || 0} User(s)</p>
              </div>

              <div className="flex flex-col items-center bg-gray-100 p-4 rounded-lg border border-gray-300 hover:shadow-md transition">
                <FaTasks className="text-3xl text-red-500" />
                <p className="mt-2 text-lg font-semibold">Tasks</p>
                <p className="text-sm text-black">{team.tasks?.length || 0} Task(s)</p>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center">
                <div className="justify-center text-center">
                  <AppLoader />
                </div>
              </div>
            ) : teamsTask.length === 0 ? (
              <p className="text-gray-500 text-center">
                No tasks available. Add a new task to get started!
              </p>
            ) : (
              <div className="flex gap-6">
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

                <div className="w-full max-h-[300px] overflow-y-auto space-y-4 pr-2">
                  {teamsTask.map((task) => (
                    <div
                      key={task.id}
                      className={classNames(
                        "flex items-center justify-between p-4 rounded-lg shadow-md transition duration-300 hover:shadow-lg",
                        {
                          "bg-green-300": task.color === "green",
                          "bg-gray-300": task.color === "gray",
                          "bg-blue-300": task.color === "blue",
                        }
                      )}
                    >
                      <Link
                        to={`/subtasks/${task.title}/${task.id}/${teamId}`}
                        state={{ alluser: allUsers }}
                        className="text-lg font-semibold text-black hover:underline"
                      >
                        {task.title}
                      </Link>
                      <div className="flex gap-3">
                        <button
                          className="text-blue-600 hover:text-blue-800 transition"
                          onClick={() => handleEdit(task)}
                        >
                          <MdEdit size={24} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800 transition"
                          onClick={() => handleDelete(task.id)}
                        >
                          <MdDelete size={24} />
                        </button>
                        <button
                          className="text-yellow-500 hover:text-yellow-800 transition"
                          onClick={handleThreeDots}
                        >
                          <HiDotsVertical size={24} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <ChatGroup
          team={team}
          onClose={() => setShowChatGroup(false)}
          currentUser={currentUser}
          users={allUsers}
        />
      )}

      {showEditModal && taskToEdit && (
        <EditTaskPopup
          setShowModal={setShowEditModal}
          taskToEdit={taskToEdit}
          onTaskUpdated={refreshTasks}
        />
      )}

      {openAssign && (
        <AssignDessignTeamTask onClose={() => setOpenAssign(false)} />
      )}

      {showModal && (
        <Addtaskpopup
          onClose={() => setShowModal(false) }
          onTaskAdded={(newTask) => {
            setTeam((prevTeam) => ({
              ...prevTeam,
              tasks: [...(prevTeam.tasks || []), newTask],
            }));
            refreshTasks();
          }}
        />
      )}

      <ToastContainer position="top-right" autoClose={1500} />
    </>
  );
};

export default Teamstask;