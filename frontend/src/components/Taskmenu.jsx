import React, { useState } from 'react';
import { MdDelete } from "react-icons/md";
import { Link } from 'react-router-dom';


const Taskmenu = () => {

  const [taskItems,setTaskItems] = useState([
    { id: "1", name: "Task 1",description:"Description for task 1" },
    { id: "2", name: "Task 2",description:"Description for task 2" },
    { id: "3", name: "Task 3" ,description:"Description for task 3"},
    { id: "4", name: "Task 4" ,description:"Description for task 4"},
    { id: "5", name: "Task 5" ,description:"Description for task 5"},
  ])
    
  const handleDelete = (id) =>{
      const updatedList = taskItems.filter((task)=>task.id !== id)
      setTaskItems(updatedList)
  }
    
  return (
    <>
    <div className="w-[60%] flex items-center justify-left bg-white p-4 mx-2 mt-1 h-auto shadow-md border-2">
      <div className="w-full rounded-lg shadow-lg p-8 space-y-2">
        <p className="text-xl text-center font-bold">YOUR TASKS</p>
        <div className="space-y-4">
          {taskItems.map((task) => (
            <div key={task.id} className="flex items-center justify-between">
             <Link
                  to={`/subtasks/${task.name}/${task.description}`}  
                  className="w-full bg-black text-white py-3 rounded-md text-sm font-semibold tracking-wide hover:bg-gray-800 focus:ring-2 focus:ring-black focus:outline-none shadow-md"
                >
                  {task.name}
                </Link>
              <button
                className="border border-black rounded-sm text-2xl mt-1 ml-2"
                onClick={() => handleDelete(task.id)}
              >
                <MdDelete />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
  )
}

export default Taskmenu