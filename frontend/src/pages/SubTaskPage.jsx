import React, { useState ,  useCallback , useEffect } from "react";
import NavBar from "../components/NavBar";
import SubTaskMenu from "../components/SubTaskMenu";
import { IoMdAdd } from "react-icons/io";
import AddSubTaskPopup from "../components/AddSubTaskPopup";
import '../../src/index.css';
import { useParams  } from "react-router-dom";
import AppLoader from "../components/App-Loader";


const SubTaskPage = () => {

  const { taskName , teamId} = useParams();
  
  
   const {  id } = useParams();
    const [loading,setLoading] = useState(true);
    const [taskData,setTaskData] = useState([]);
  const [subtasks, setSubtasks] = useState([]);



  const token = sessionStorage.getItem("token");

  const fetchData = async (endpoint, options) => {
    const defaultHeaders = {
      Authorization: `Bearer ${token}`,
    };

    const headers =
      options?.body instanceof FormData
        ? { ...defaultHeaders, ...options?.headers }
        : { ...defaultHeaders, "Content-Type": "application/json", ...options?.headers };

    try {
      const response = await fetch(`/api${endpoint}`, {
        ...options,
        headers,
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
  
const fetchSubtasks = useCallback(async () => {
  try {
    const queryParams = new URLSearchParams({ taskId: id }).toString();
    const data = await fetchData(`/user/getAllSubTask?${queryParams}`, {
      method: "GET",
    });

    setLoading(false);
    setSubtasks(data.data);
    setTaskData(data.percentage);
  } catch (error) {
    console.error("Error fetching subtasks:", error);
  }
}, [id]);

useEffect(() => {
  fetchSubtasks();
}, [fetchSubtasks]);

const addSubtask = () => {
  fetchSubtasks();
};



  const[showSubTaskPopup,setShowSubTaskPopup] = useState(false);
  return (
    <>
      <NavBar />

        <div className=" mt-5">

        <div className="flex items-center justify-center">
            <div className="bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 rounded-xl shadow-sm border border-gray-200 px-8 py-4">
              <h1 className="text-2xl font-semibold text-gray-800">
                {taskName} subtask's 
              </h1>
            </div>
        </div>

                    <div className="flex justify-end items-center mt-3 mx-6 ">
                            <button
                              type="button"
                              className="bg-black text-white rounded-lg px-4 py-2 flex items-center gap-2 border-2 border-black shadow-md hover:bg-white hover:text-black transition-all duration-300"
                              onClick={() => setShowSubTaskPopup(true)}
                            >
                              <IoMdAdd className="inline-block text-xl" /> Add Task
                            </button>
                          </div>
           </div> 
    {loading ? 
      (
        <div className="flex justify-center">
                    <div className="justify-center text-center ">
                      <AppLoader />
                    </div>
                  </div>
      ) 
      :
      <div className="flex flex-row m-4">
        <SubTaskMenu  subtasks={subtasks} taskData={taskData}  setSubtasks={setSubtasks} />
      </div>
    }

      {showSubTaskPopup &&  <AddSubTaskPopup  addSubtask={() => addSubtask() }  teamId={teamId} onTaskAdded={() => setShowSubTaskPopup(false)}  />}
    </>
  );
};

export default SubTaskPage;