import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import Teamsmenu from "../components/Teamsmenu";
import { useNavigate } from "react-router-dom";
import NavBarForAuth from "../components/NavBarForAuth";


const Teamspage = () => {
    const navigate = useNavigate();

    
       return(
        <>
            <NavBarForAuth />

            <div className="flex  mt-5">
            <div className="text-2xl bg-white border-2 border-black text-center mt-3 p-2 rounded-md w-[20%]  mx-auto">
            MY Teams Dashboard
            </div>
            <div className="text-2xl mt-3 p-2 mx-auto ">
            <button 
                type="buton" 
                className="bg-green-300 text-black rounded-lg px-6 py-2 border-2 border-black"
                onClick={ () => navigate("/teams/addteams")}
                >
                <IoMdAdd />
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