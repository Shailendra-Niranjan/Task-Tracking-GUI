import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";
import { useState,useEffect } from "react";

const Chatheader = ({teamName,handleLeaveRoom,currentUser}) => {

  

    return(
    <>
    <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
              <h1 className="text-xl font-semibold text-gray-800 mx-10">
                Team: <span className="text-blue-600">{teamName}</span>
              </h1>
              <div className="flex items-center space-x-4">
                <p className="text-gray-600">
                  User: <span className="font-medium">{currentUser}</span>
                </p>
                <div
                  onClick={handleLeaveRoom}
                  className="bg-red-500 cursor-pointer hover:bg-red-600 text-white px-4 py-2 rounded-full flex items-center space-x-2 transition duration-200"
                >
                  <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                  <span>Leave Room</span>
                </div>
              </div>
            </header>
    </>
)
}

export default Chatheader;