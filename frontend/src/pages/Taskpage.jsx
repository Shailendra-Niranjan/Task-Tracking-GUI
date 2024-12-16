import React from "react";
import Taskmenu from "../components/Taskmenu";
import Taskimage from "../components/Taskimage";
import NavBarForAuth from "../components/NavBarForAuth";

const Taskpage = () => {
    return(
        <>
        <NavBarForAuth />
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