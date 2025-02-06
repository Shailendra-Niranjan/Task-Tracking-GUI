import React, { useEffect, useMemo, useState } from "react";
import { MdDelete } from "react-icons/md";
import { Progress } from "antd";
import { useParams } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import EditSubTaskPopup from "./EditSubTaskPopup";
import AssignDessignPopup from "./AssignDessignPopup"
import { HiDotsVertical } from "react-icons/hi";
import { useLocation } from "react-router-dom";



const SubTaskMenu = ({subtasks , taskData , setSubtasks}) => {

     const { taskName, description, id } = useParams();

  const [showeditPopup,setShowEditPopup] = useState(false);
  const [allUser, setAllUser] = useState({});
  const [threedotTask, setThreedotTask] = useState([]);


  const location = useLocation();

  useEffect( () => {
    if(location.state?.alluser)
    setAllUser(location.state.alluser);

    },[location.state])

  const { teamId } = useParams();

  
  const[openAssign ,setOpenAssign] = useState(false);
    const[editFormdata ,setEditFormData] = useState({
    id: '',
    title: '',
    Description: '',
  })

  const token = sessionStorage.getItem("token");

  const taskStatusOptions = [
    { value: "PENDING", label: "Pending" },
    { value: "COMPLETED", label: "Completed" },
    { value: "ONGOING", label: "Ongoing" },
    { value: "NOTSTARTED", label: "Not Started" },
  ];

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

  

  const handleStatusChange = async (id, newStatus) => {
    setSubtasks((prevSubtasks) =>
      prevSubtasks.map((subtask) =>
        subtask.id === id ? { ...subtask, status: newStatus } : subtask
      )
    );

    try {
      const formData = new FormData();
      formData.append("status", newStatus);
      formData.append("subTaskId", id);

      const response = await fetchData(`/user/statusOfSubtask`, {
        method: "POST",
        body: formData,
      });

      console.log("Status updated:", response);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDelete = async (id) => {
    try{
      
      if(teamId != 'null'){
        console.log('team deleted called',teamId)
        const response = await fetchData(`user/delete/subTask?uuid=${id}&teamId=${teamId}`,{
          method: 'GET'
        })
      }
      else{
        console.log('task deleted called')
        const response = await fetchData(`user/delete/subTask?uuid=${id}`,{
          method: 'GET'
        })
      }
      if(response.Status == true)
        console.log('deleted successfully');
    }catch(err){
      console.log('error deleting subtask',err);
    }
  };

  const progress = useMemo(() => {
    const totalSubtasks = subtasks.length;
    const completedCount = subtasks.filter(
      (subtask) => subtask.status === "COMPLETED"
    ).length;

    return totalSubtasks === 0 ? 100 : (completedCount / totalSubtasks) * 100;
  }, [subtasks]);

  const handleEdit = (id,newTitle,newDescrip) => {
    setShowEditPopup(true);
    setEditFormData({
      id: id,
      title: newTitle,
      Description: newDescrip,
    });
  };

  const handlethreeDots = (id) => {
    const clickedTask =  subtasks.filter( (task) => task.id == id )
    setThreedotTask(clickedTask); 
    setOpenAssign(true);
  }

  

  
  return (
    <div className="w-full flex items-center justify-center bg-white p-4 mx-2 mt-1 h-auto shadow-md border-2">
      <div className="w-full max-w-6xl flex">
       <div className="w-1/2 flex flex-col items-center justify-center p-4">
          <div className="relative flex flex-col items-center justify-center w-full">
            <Progress
              type="circle"
              percent={progress}
              size={200}
              strokeColor="#1890ff"
              status="active"
              format={() => taskData +'%' }
            />
          </div>
          <div className="text-center mt-4">
            <p className="text-xl font-bold">{taskName}</p>
            <p className="text-lg text-gray-600">{description}</p>
          </div>
        </div>

        {/* Right Half - Subtasks */}
        <div className="w-1/2 p-4">
          <div className="w-full max-h-[300px] overflow-y-auto scrool space-y-5">
            {
              subtasks.map((subtask) => (
                <div
                  key={subtask.id}
                  className={`flex items-center justify-between gap-4 mt-2 border-2 border-black  ${
                    subtask.status === "COMPLETED" ? "bg-green-300" : "bg-white"
                  } p-4 rounded-lg shadow-md`}
                >
                  <div className="w-full text-center sm:w-3/4">
                    <p
                      className={`text-lg font-bold ${
                        subtask.status === "COMPLETED"
                          ? "text-green-800"
                          : "text-black"
                      }`}
                    >
                      {subtask.title}
                    </p>
                  </div>
                  <div className="flex gap-2">
                  <select
                      value={subtask.status}
                      onChange={(e) =>
                        handleStatusChange(subtask.id, e.target.value)
                      }
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
                      onClick={() => handleDelete(subtask.id) }
                    >
                      <MdDelete />
                    </button>
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => handleEdit(subtask.id,subtask.title,subtask.description)}
                    >
                    <MdEdit size={24} />
                    </button>
                    { teamId != 'null' ?
                    (
                      <button 
                      className="text-yellow-500 hover:text-yellow-800 transition"
                      onClick={ () => handlethreeDots(subtask.id)}
                      >
                      <HiDotsVertical size={24} />
                      </button>
                    ) : <p></p>
                    }
                  
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>

    {
      showeditPopup &&  < EditSubTaskPopup editFormdata={editFormdata}  onclose={() => setShowEditPopup(false)} /> 
    }
    {
      openAssign && <AssignDessignPopup  allUser={allUser}  subTask={threedotTask} onClose ={() => setOpenAssign(false)} />
    }
    </div>
  );


};

export default SubTaskMenu;

