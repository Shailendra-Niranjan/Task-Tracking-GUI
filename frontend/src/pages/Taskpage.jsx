import React from "react";
import NavBar from "../components/NavBar";
import Taskmenu from "../components/Taskmenu";
import Taskimage from "../components/Taskimage";

const Taskpage = () => {
    return(
        <>
        <NavBar />
        <div className="text-2xl bg-white border-2 border-black text-center mt-3 p-2 rounded-md w-[20%]  mx-auto">
            MY Task Dashboard
        </div>

        <div className=" flex flex-row m-4">
            <Taskmenu />
            <Taskimage />
        </div>

        </>
    )
}

export default Taskpage;