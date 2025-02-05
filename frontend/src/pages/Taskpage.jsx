import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import Addusertaskpopup from "../components/Addusertaskpopup";
import Taskmenu from "../components/Taskmenu";
import NavBar from "../components/NavBar";


const Taskpage = () => {
  const [showModal, setShowModal] = useState(false);

  

  return (
    <>
      <NavBar />

      <div className="    mt-5">
      <div className="flex items-center justify-center">
            <div className="bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 rounded-xl shadow-sm border border-gray-200 px-8 py-4">
              <h1 className="text-2xl font-semibold text-gray-800">
                My Task Dashboard
              </h1>
            </div>
        </div>
      </div>

      <div className="flex justify-end mx-12 mt-5">
        <button
          type="button"
          className="bg-black text-white rounded-lg px-4 py-2 flex items-center gap-2 border-2 border-black shadow-md hover:bg-white hover:text-black transition-all duration-300"
          onClick={() => setShowModal(true)}
        >
          <IoMdAdd />
          Add Task
        </button>
      </div>
      

      {showModal && <Addusertaskpopup setShowModal={setShowModal}/>}
        <Taskmenu />
    </>
  );
};

export default Taskpage;