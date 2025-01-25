import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBarForAuth from "../components/NavBarForAuth";
import { IoMdAdd } from "react-icons/io";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { HiUserGroup } from "react-icons/hi";
import { FaBookDead, FaTasks } from "react-icons/fa";
import Addtaskpopup from "../components/Addtaskpopup";
import { RiDeleteBin2Line } from "react-icons/ri";
import { toFormData } from "axios";

const Teamstask = () => {
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [team, setTeam] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { teamId } = location.state || {};

  const token = sessionStorage.getItem("token");

  const fetchData = async (endpoint, options) => {
    const defaultHeaders = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    try {
      const response = await fetch(`/api${endpoint}`, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options?.headers
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  };


  useEffect(() => {
    const getTeam = JSON.parse(sessionStorage.getItem("response") || "[]");
    const selectedTeam = getTeam.find((x) => x.id === teamId);


    if (!selectedTeam) {
      navigate("/teams");
    } else {
      setTeam(selectedTeam);
      setLoading(false);
    }
  }, [teamId, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader border-t-4 border-b-4 border-green-500 rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }

  if (!team) {
    return <p>Unable to load team data. Please try again.</p>;
  }

  const { id, creationDateTime, teamName, admins, users, tasks } = team;

  const handleTaskDelete = async (taskId) => {
    
    try{

      const deleteTeam = await fetchData(`/user/delete/task?uuid=${taskId}`,{
        method : "GET",
      })
      console.log('deleted');

    }
    catch(err){
      console.log(err);
    }
  }

  
  return (
    <>
      <NavBarForAuth />
      <div className="text-2xl bg-white border-2 border-black text-center mt-3 p-2 rounded-md w-[90%] max-w-sm mx-auto">
        Teams Task Dashboard
      </div>

      <div className="flex justify-end items-center mt-3 mx-6">
        <button
          type="button"
          className="bg-green-300 text-black rounded-lg px-2 py-2 border-2 border-black"
          onClick={() => setShowModal(true)}
        >
          <IoMdAdd className="inline-block text-xl" /> Add Task
        </button>
      </div>

      <div className="w-[95%] max-w-4xl flex flex-col bg-white p-4 mx-auto mt-9 h-auto shadow-md border-2 rounded-lg">
        <div className="w-full p-8 space-y-6">
          <p className="text-xl text-center font-bold">Your Team's Details</p>

          <div className="flex justify-around space-x-4 mt-4">
            <div className="flex flex-col items-center bg-gray-100 p-4 rounded-lg border border-gray-300 hover:shadow-md transition">
              <MdOutlineAdminPanelSettings className="text-3xl text-blue-500" />
              <p className="mt-2 text-lg font-semibold">Admins</p>
              <p className="text-sm text-black">{admins.length} Admin(s)</p>
            </div>

            <div className="flex flex-col items-center bg-gray-100 p-4 rounded-lg border border-gray-300 hover:shadow-md transition">
              <HiUserGroup className="text-3xl text-green-500" />
              <p className="mt-2 text-lg font-semibold">Users</p>
              <p className="text-sm text-black">{users.length} User(s)</p>
            </div>

            <div className="flex flex-col items-center bg-gray-100 p-4 rounded-lg border border-gray-300 hover:shadow-md transition">
              <FaTasks className="text-3xl text-red-500" />
              <p className="mt-2 text-lg font-semibold">Tasks</p>
              <p className="text-sm text-black">{tasks.length} Task(s)</p>
            </div>
          </div>

          <div className=" p-4 rounded-lg ">
            <p className="font-bold text-center">Tasks:</p>
            {tasks.length > 0 ? (
              tasks.map((task, index) => (
                <div
                  key={index}
                  className="text-center py-1 rounded-md text-sm font-semibold px-5 flex items-center"
                >
                  <button
                  className=" w-full p-2  text-white transition-colors duration-200 bg-black border-2 border-black rounded-md"
                  >
                  Task: {task.title}
                  </button>
                  <button
                  className="text-red-700 text-2xl"
                  onClick={() => handleTaskDelete(task.id)}
                  >
                  <RiDeleteBin2Line/>
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600 text-2xl">
                No tasks available, spend your time with family.
              </p>
            )}
          </div>
        </div>
      </div>

      {showModal && <Addtaskpopup onClose={() => setShowModal(false)} 
                    onTaskAdded={(newTask) => {setTeam((prevTeam) => ({  ...prevTeam,tasks: [...prevTeam.tasks, newTask],}));
      }} />}
    </>
  );
};

export default Teamstask;
