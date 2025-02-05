import axios from "axios";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { IoIosClose } from "react-icons/io";
import { useParams } from "react-router-dom";

const EditSubTaskPopup = ({ editFormdata ,onclose}) => {
  const { taskName } = useParams();

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
    id: editFormdata.id,
    title: editFormdata.title,
    description: editFormdata.Description,
  });


  const handleEditTask= async (subTaskId) => {

    const payload = {
        title: subTaskForm.title,
        description : subTaskForm.description    
    }
    try{
        const response = await fetchData(`/user/editSubTaskInTask/${subTaskId}`,{
            method: 'POST',
            body: JSON.stringify(payload),
        })
        console.log(response);
        if(response.Status == true){
            onclose();
        }
    }
    catch(err){
        console.log('error editing taxk' , err)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[30%]">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold mb-4 text-center">Edit Subtask</h2>
          <button
            className="text-red-500 hover:text-red-600"
            onClick={() => onclose()}
          >
            <IoIosClose size={24} />
          </button>
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Task Title</label>
          <input
            type="text"
            disabled
            value={taskName}
            className="w-full border border-gray-300 bg-gray-200 rounded-md px-4 py-2 cursor-not-allowed"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Subtask Title</label>
          <input
            type="text"
            value={subTaskForm.title}
            onChange={(e) =>
              setSubTaskForm((prev) => ({
                ...prev,
                title: e.target.value,
              }))
            }
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Description</label>
          <input
            type="text"
            value={subTaskForm.description}
            onChange={(e) =>
              setSubTaskForm((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />
        </div>

        <div className="flex justify-center space-x-4">
          <button
            className={`${
              subTaskForm.title && subTaskForm.description
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-gray-300 cursor-not-allowed"
            } text-white p-2 rounded-lg flex items-center`}
            onClick={() => handleEditTask(subTaskForm.id)}
            disabled={!subTaskForm.title || !subTaskForm.description}
          >
            <IoMdAdd size={20} />
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditSubTaskPopup;
