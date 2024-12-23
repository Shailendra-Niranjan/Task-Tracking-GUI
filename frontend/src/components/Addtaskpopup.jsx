import { useState } from "react";

const Addtaskpopup = () => {

    const [taskDetails, setTaskDetails] = useState({
        title: "",
        description: "",
        startAt: new Date().toISOString(), // Current date and time in ISO format with 'Z'
        endAt: "",
      });

    const[showModal,setShowModal] = useState(true);

    const handleAddTask = () => {

    }

    return(showModal &&  (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[30%]">
            <h2 className="text-xl font-semibold mb-4">Add Task</h2>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Title</label>
              <input
                type="text"
                value={taskDetails.title}
                onChange={(e) => setTaskDetails({ ...taskDetails, title: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-4 py-2"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Description</label>
              <textarea
                value={taskDetails.description}
                onChange={(e) => setTaskDetails({ ...taskDetails, description: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-4 py-2"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Start At</label>
              <input
                type="datetime-local"
                value={new Date(taskDetails.startAt).toISOString().slice(0, -1)}
                onChange={(e) => setTaskDetails({ ...taskDetails, startAt: new Date(e.target.value).toISOString() })}
                className="w-full border border-gray-300 rounded-md px-4 py-2"
              />
            </div>
            <div className="mb-4">
            <label className="block font-semibold mb-1">End At</label>
            <input
            type="datetime-local"
            value={taskDetails.startAt.slice(0, -1)} // Remove 'Z' for datetime-local
            onChange={(e) =>
            setTaskDetails({ ...taskDetails, startAt: new Date(e.target.value).toISOString() })
            }
            />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                onClick={handleAddTask}
              >
                <p>"Add Task"</p>
              </button>
            </div>
          </div>
        </div>
    ))
}

export default Addtaskpopup;