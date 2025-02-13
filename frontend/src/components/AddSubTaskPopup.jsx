import { useState } from "react";
import { useParams } from "react-router-dom";
import { IoIosClose } from "react-icons/io";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const AddSubTaskPopup = ({ addSubtask ,onTaskAdded, taskTitle, taskID , teamId }) => {

  const { id: paramTaskID, taskName } = useParams();  
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

  const [subTaskForm, setSubTaskForm] = useState({
    title: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  const handleAddSubTask = async () => {
    const finalTaskID = taskID || paramTaskID; // Use prop taskID if available, otherwise use URL param

    if (!finalTaskID) {
      toast.error("Task ID is missing!");
      return;
    }

    const payload = { ...subTaskForm };
    setLoading(true);
    
    try {

      if(teamId != 'null'){
        const queryParams = new URLSearchParams( { teamId : teamId}).toString();
        const response = await fetchData(`/user/addSubTaskInTask/${finalTaskID}?${queryParams}`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        if(response)
        onTaskAdded(); 
        addSubtask(); 
      }
      else{
        const response = await fetchData(`/user/addSubTaskInTask/${finalTaskID}`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        if(response)
          onTaskAdded();
      }
      setTimeout(() =>  toast.success("New Subtask Added!!"),1000);
    } catch (error) {
      toast.error("Oops! Error in adding subtask");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[30%]">
        <div className="flex">
          <h2 className="text-xl font-semibold mb-4 text-center mx-auto">
            Add Subtask
          </h2>
          <button className="text-xl bg-red-500 h-6" onClick={onTaskAdded}>
            <IoIosClose />
          </button>
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Task Title</label>
          <input
            type="text"
            disabled
            value={taskTitle || taskName} // Use taskTitle prop if available, otherwise use taskName from params
            className="w-full border border-gray-300 bg-gray-400 rounded-md px-4 py-2"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Add SubTask</label>
          <input
            type="text"
            value={subTaskForm.title}
            onChange={(e) =>
              setSubTaskForm((prev) => ({ ...prev, title: e.target.value }))
            }
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Description</label>
          <textarea 
            value={subTaskForm.description}
            onChange={(e) =>
              setSubTaskForm((prev) => ({ ...prev, description: e.target.value }))
            }
            className="w-full border border-gray-300 rounded-md px-4 py-2"
            >
            </textarea>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            className={`${
              subTaskForm.title && subTaskForm.description
                ? "bg-black hover:bg-red-600"
                : "bg-gray-400 cursor-not-allowed"
            } text-white p-1 rounded-lg flex text-center items-center`}
            onClick={handleAddSubTask}
            disabled={!subTaskForm.title || !subTaskForm.description}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
          <ToastContainer position="top-right" autoClose={2000} />
        </div>
      </div>
    </div>
  );
};

export default AddSubTaskPopup;
