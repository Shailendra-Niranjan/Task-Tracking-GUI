import { useState } from "react";
import NavBarForAuth from "../components/NavBarForAuth";
import { IoMdAdd } from "react-icons/io";
import Addtaskpopup from "../components/Addtaskpopup";

const Teamstask = () => {

    const[loading,setLoading] = useState(false);
    const[showModal,setShowModal]= useState(false);

    return(

        <>
        <NavBarForAuth />

        <div className="text-2xl bg-white border-2 border-black text-center mt-3 p-2 rounded-md w-[20%] mx-auto">
        Teams Task Dashboard
        </div>

        <div className="text-2xl bg-white text-right mt-3 p-2 rounded-md mx-12">
                <button
                  type="button"
                  className="bg-green-300 text-black rounded-lg px-6 py-2 border-2 border-black"
                  onClick={() => setShowModal(true)}
                >
                  <IoMdAdd />
                </button>
                <p className="text-sm font-bold mx-1">add task</p>
              </div>

        <div className="w-[60%] flex items-center justify-left bg-white p-4 mx-5 mt-9  h-auto shadow-md border-2 ">
        <div className="w-full rounded-lg shadow-lg p-8 space-y-2">
        <p className="text-xl text-center font-bold">YOUR Team's Task </p>

        <div className="space-y-4">
          {loading ? 
          (
            <p className="text-center text-gray-600"> Loading teams...</p>
          )  : 
          (
            <p className="text-center text-gray-600 text-2xl">No tasks avilable,spend your time with family.</p>
          )}
        </div>
      </div>
    </div>

    {
        showModal && <Addtaskpopup />
    }


    </>
    )
}

export default Teamstask;