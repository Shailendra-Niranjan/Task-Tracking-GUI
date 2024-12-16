import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import { FaCheckSquare } from "react-icons/fa";
import { Progress } from "antd";
import { useParams } from "react-router-dom";

function SubTaskMenu() {



  
  const { taskName, description } = useParams();
  const [completedTasks, setCompletedTasks] = useState({});
  const [subtasks, setSubtasks] = useState([
    { id: "1", name: "Subtask 1" },
    { id: "2", name: "Subtask 2" },
    { id: "3", name: "Subtask 3" },
    { id: "4", name: "Subtask 4" },
    { id: "5", name: "Subtask 5" },
  ]);

  const handleComplete = (index) => {
    if (completedTasks[index]) return;
    setCompletedTasks((prev) => ({ ...prev, [index]: true }));
  };

  const handleDelete = (id) => {
    const updatedSubtasks = subtasks.filter((subtask) => subtask.id !== id);
    setSubtasks(updatedSubtasks);

   
    setCompletedTasks((prev) => {
      const updatedCompletedTasks = { ...prev };
      delete updatedCompletedTasks[id];
      return updatedCompletedTasks;
    });
  };

  const calculateOverallProgress = () => {
   
    const completedSubtasks = Object.keys(completedTasks).length;
    const totalSubtasks = subtasks.length;
    return totalSubtasks === 0 ? 100 : (completedSubtasks / totalSubtasks) * 100;
  };

  const progress = calculateOverallProgress();

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
              format={() =>
                progress === 100 ? (
                  <FaCheckSquare size={50} className="text-center mx-auto " color="green" />
                ) : (
                  progress
                )
              }
            />
          </div>
          <div className="text-center mt-4">
            <p className="text-xl font-bold">{taskName}</p>
            <p className="text-lg text-gray-600">{description}</p>
          </div>
        </div>

        {/* Right Half - Subtasks */}
        <div className="w-1/2 p-4">
          <div className="w-full max-w-xl mx-auto space-y-4">
            {subtasks.map((subtask) => (
              <div
                key={subtask.id}
                className={`flex items-center justify-between gap-4 mt-2 transition-all duration-500 ease-in-out border border-black ${
                  completedTasks[subtask.id] ? "bg-green-300" : "bg-white"
                } p-4 rounded-lg shadow-md`}
              >
                <div className="w-full text-center sm:w-3/4">
                  <p
                    className={`text-lg font-bold ${
                      completedTasks[subtask.id] ? "text-green-800" : "text-black"
                    } transition-all duration-500`}
                  >
                    {completedTasks[subtask.id] ? "Completed" : "Not Completed"}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    className="border border-black rounded-sm text-2xl p-1"
                    onClick={() => handleDelete(subtask.id)}
                  >
                    <MdDelete />
                  </button>
                  <button
                    className="border border-black rounded-sm text-2xl p-1"
                    onClick={() => handleComplete(subtask.id)}
                  >
                    <FaCheckSquare
                      color={completedTasks[subtask.id] ? "green" : "black"}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubTaskMenu;
