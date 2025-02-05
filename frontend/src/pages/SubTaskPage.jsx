import React, { useState } from "react";
import NavBar from "../components/NavBar";
import SubTaskMenu from "../components/SubTaskMenu";
import { IoMdAdd } from "react-icons/io";
import AddSubTaskPopup from "../components/AddSubTaskPopup";
import '../../src/index.css';
import { useParams } from "react-router-dom";


const SubTaskPage = () => {

  const {teamId} = useParams();


  const[showSubTaskPopup,setShowSubTaskPopup] = useState(false);
  return (
    <>
      <NavBar />

        <div className=" mt-5">

        <div className="flex items-center justify-center">
            <div className="bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 rounded-xl shadow-sm border border-gray-200 px-8 py-4">
              <h1 className="text-2xl font-semibold text-gray-800">
                Subtask Page
              </h1>
            </div>
        </div>

                    <div className="flex justify-end items-center mt-3 mx-6 ">
                            <button
                              type="button"
                              className="bg-black text-white rounded-lg px-4 py-2 flex items-center gap-2 border-2 border-black shadow-md hover:bg-white hover:text-black transition-all duration-300"
                              onClick={() => setShowModal(true)}
                            >
                              <IoMdAdd className="inline-block text-xl" /> Add Task
                            </button>
                          </div>
          </div>

      <div className="flex flex-row m-4">
        <SubTaskMenu />
      </div>

      {showSubTaskPopup &&  <AddSubTaskPopup  teamId={teamId} onTaskAdded={() => setShowSubTaskPopup(false)} />}
    </>
  );
};

export default SubTaskPage;