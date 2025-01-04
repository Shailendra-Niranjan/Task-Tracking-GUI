import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import Addtaskpopup from "../components/Addtaskpopup";
import Taskmenu from "../components/Taskmenu";
import NavBar from "../components/NavBar";

const Taskpage = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <NavBar />

      <div className="text-2xl bg-white border-2 border-black text-center mt-5 p-4 rounded-md w-[40%] mx-auto shadow-md">
        MY TASK DASHBOARD
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

      {showModal && <Addtaskpopup setShowModal={setShowModal} />}
      <Taskmenu />
    </>
  );
};

export default Taskpage;