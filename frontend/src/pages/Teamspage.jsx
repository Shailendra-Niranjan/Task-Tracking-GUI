import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import Teamsmenu from "../components/Teamsmenu";
import { useNavigate } from "react-router-dom";

import NavBar from "../components/NavBar";


const Teamspage = () => {
    const navigate = useNavigate();

    
       return(
        <>
            <NavBar />

            <div className="    mt-5">
            <div className="text-2xl bg-white border-2 border-black text-center mt-3 p-2 rounded-md w-[90%] max-w-sm mx-auto">
             My Teams  Dashboard
            </div>
        

       
            <div className="flex justify-end items-center mt-3 mx-6">
            <button 
                type="buton" 
                className="bg-green-300 text-black rounded-lg px-2 py-2 border-2 border-black"
                onClick={ () => navigate("/teams/addteams")}
                >
                <IoMdAdd className="inline-block text-xl" /> Add Teams
            </button>
            </div>
            </div>

            <div className="flex-row mt-4 mx-7">
                <Teamsmenu  />
            </div>

        
        </>
    )
}

export default Teamspage;